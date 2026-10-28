const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required. Please log in." });
  const token = header.slice(7).trim();
  if (!token) return res.status(401).json({ message: "Authentication token is missing." });
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(500).json({ message: "Server authentication is not configured." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId || !mongoose.isValidObjectId(decoded.userId)) return res.status(401).json({ message: "Invalid authentication token." });
    req.user = { id: decoded.userId };
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired. Please log in again." });
  }
};
module.exports = authMiddleware;
