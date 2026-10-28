// One-time optional migration from legacy JSON persistence into MongoDB.
// Run from server/: node scripts/migrateLegacyJson.js
// JSON files are never deleted or modified by this script.
const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user");
const Application = require("../src/models/application");

dotenv.config({ path: path.join(__dirname, "../.env") });
const usersPath = path.join(__dirname, "../src/data/users.json");
const applicationsPath = path.join(__dirname, "../data/applications.json");
const readArray = async (file) => {
  try { const parsed = JSON.parse(await fs.readFile(file, "utf8")); return Array.isArray(parsed) ? parsed : []; }
  catch (error) { if (error.code === "ENOENT") return []; throw error; }
};

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in server/.env");
  await mongoose.connect(process.env.MONGO_URI);
  const legacyUsers = await readArray(usersPath);
  const legacyApplications = await readArray(applicationsPath);
  const idMap = new Map();
  const emailsSeen = new Set();
  let importedUsers = 0, skippedUsers = 0, importedApplications = 0, skippedApplications = 0;

  for (const legacy of legacyUsers) {
    const email = String(legacy.email || "").trim().toLowerCase();
    const hashedPassword = legacy.passwordHash || legacy.password;
    if (!email || !legacy.name || !hashedPassword) { skippedUsers++; continue; }
    if (emailsSeen.has(email)) {
      const existing = await User.findOne({ email });
      if (existing && legacy.id) idMap.set(String(legacy.id), existing._id);
      skippedUsers++;
      continue;
    }
    emailsSeen.add(email);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name: String(legacy.name).trim(), email, password: hashedPassword });
      importedUsers++;
    } else skippedUsers++;
    if (legacy.id) idMap.set(String(legacy.id), user._id);
  }

  for (const legacy of legacyApplications) {
    const mappedUser = idMap.get(String(legacy.userId || ""));
    if (!mappedUser || !legacy.jobTitle || !legacy.company || !legacy.location || !legacy.applicationDate) {
      skippedApplications++;
      continue;
    }
    const existing = await Application.findOne({ user: mappedUser, jobTitle: legacy.jobTitle, company: legacy.company, applicationDate: legacy.applicationDate });
    if (existing) { skippedApplications++; continue; }
    await Application.create({ user: mappedUser, jobTitle: legacy.jobTitle, company: legacy.company, jobType: legacy.jobType || "Full Time", location: legacy.location, applicationDate: legacy.applicationDate, jobUrl: legacy.jobUrl || "", salary: legacy.salary == null ? "" : String(legacy.salary), status: legacy.status || "Applied", notes: legacy.notes || "", createdAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(), updatedAt: legacy.updatedAt ? new Date(legacy.updatedAt) : new Date() });
    importedApplications++;
  }

  console.log(`Migration complete. Users imported: ${importedUsers}; users skipped/merged: ${skippedUsers}; applications imported: ${importedApplications}; applications skipped: ${skippedApplications}.`);
  console.log("Legacy JSON files were preserved. Applications without a matching legacy user ID were skipped for safety.");
  await mongoose.disconnect();
}
main().catch(async (error) => { console.error("Migration failed:", error.message); await mongoose.disconnect().catch(() => {}); process.exitCode = 1; });
