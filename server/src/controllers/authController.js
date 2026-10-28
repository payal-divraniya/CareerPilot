const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

function createToken(userId) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2 || cleanName.length > 100) return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
    if (await User.findOne({ email: cleanEmail }).lean()) return res.status(409).json({ message: "An account with this email already exists." });
    const user = await User.create({ name: cleanName, email: cleanEmail, password: await bcrypt.hash(password, 12) });
    return res.status(201).json({ message: "Account created successfully.", user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Unable to create your account." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password." });
    const token = createToken(user._id.toString());
    return res.status(200).json({ message: "Login successful.", token, user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Unable to log in. Please try again." });
  }
};

module.exports = { registerUser, loginUser };
