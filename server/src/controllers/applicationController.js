const mongoose = require("mongoose");
const Application = require("../models/application");

const allowedStatuses = ["Applied", "Interview", "Shortlisted", "Offer", "Rejected", "Withdrawn"];
const allowedJobTypes = ["Full Time", "Full-time", "Part Time", "Part-time", "Internship", "Contract", "Remote"];
const editableFields = ["jobTitle", "company", "jobType", "location", "applicationDate", "jobUrl", "salary", "status", "notes"];

function validatePayload(body, partial = false) {
  const errors = [];
  const required = ["jobTitle", "company", "location", "applicationDate"];
  for (const field of required) {
    if ((!partial || body[field] !== undefined) && (typeof body[field] !== "string" || !body[field].trim())) errors.push(`${field} is required.`);
  }
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) errors.push("Please select a valid application status.");
  if (body.jobType !== undefined && !allowedJobTypes.includes(body.jobType)) errors.push("Please select a valid job type.");
  if (body.jobUrl) {
    try { const url = new URL(body.jobUrl); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { errors.push("Job URL must be a valid http or https URL."); }
  }
  if (typeof body.notes === "string" && body.notes.length > 5000) errors.push("Notes must be 5000 characters or fewer.");
  return errors;
}

const createApplication = async (req, res) => {
  try {
    const body = req.body || {};
    const errors = validatePayload(body);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const application = await Application.create({
      user: req.user.id,
      jobTitle: body.jobTitle.trim(), company: body.company.trim(),
      jobType: body.jobType || "Full Time", location: body.location.trim(),
      applicationDate: body.applicationDate, jobUrl: (body.jobUrl || "").trim(),
      salary: body.salary == null ? "" : String(body.salary).trim(),
      status: body.status || "Applied", notes: (body.notes || "").trim(),
    });
    return res.status(201).json({ message: "Application created successfully.", application: application.toJSON() });
  } catch (error) {
    console.error("Create application error:", error.message);
    return res.status(500).json({ message: "Unable to create application." });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({ createdAt: -1 }).lean({ virtuals: true });
    const normalized = applications.map(({ _id, user, ...item }) => ({ ...item, id: _id.toString() }));
    return res.status(200).json({ applications: normalized });
  } catch (error) {
    console.error("Get applications error:", error.message);
    return res.status(500).json({ message: "Unable to load applications." });
  }
};

const updateApplication = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Application not found." });
    const body = req.body || {};
    const updates = {};
    for (const field of editableFields) if (body[field] !== undefined) updates[field] = body[field];
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "Provide at least one field to update." });
    const errors = validatePayload(updates, true);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    for (const field of ["jobTitle", "company", "location", "jobUrl", "notes"]) if (typeof updates[field] === "string") updates[field] = updates[field].trim();
    if (updates.salary !== undefined) updates.salary = String(updates.salary).trim();
    const application = await Application.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: updates }, { returnDocument: "after", runValidators: true });
    if (!application) return res.status(404).json({ message: "Application not found." });
    return res.status(200).json({ message: "Application updated successfully.", application: application.toJSON() });
  } catch (error) {
    console.error("Update application error:", error.message);
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Unable to update application." });
  }
};

const deleteApplication = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Application not found." });
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ message: "Application not found." });
    return res.status(200).json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("Delete application error:", error.message);
    return res.status(500).json({ message: "Unable to delete application." });
  }
};

module.exports = { createApplication, getApplications, updateApplication, deleteApplication };
