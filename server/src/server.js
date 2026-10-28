const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });
const connectDB = require("./config/db");
const authRoutes = require("./routes/AuthRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173,http://127.0.0.1:5173").split(",").map((origin) => origin.trim());
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error("Origin is not allowed by CORS.")); }, credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.get("/", (_req, res) => res.status(200).json({ success: true, message: "CareerPilot Job Application Tracker API is running." }));
app.get("/api/health", (_req, res) => res.status(200).json({ success: true, message: "CareerPilot API is healthy." }));
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use((_req, res) => res.status(404).json({ message: "API route not found." }));
app.use((error, _req, res, _next) => {
  if (error.message === "Origin is not allowed by CORS.") return res.status(403).json({ message: "This origin is not allowed to access the API." });
  if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ message: "Invalid JSON request body." });
  console.error("Unhandled server error:", error.message);
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be configured with at least 32 characters in server/.env.");
    }
    await connectDB();
    app.listen(PORT, () => console.log(`CareerPilot API running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};
startServer();
