const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  jobTitle: { type: String, required: true, trim: true, maxlength: 160 },
  company: { type: String, required: true, trim: true, maxlength: 160 },
  jobType: { type: String, enum: ["Full Time", "Full-time", "Part Time", "Part-time", "Internship", "Contract", "Remote"], default: "Full Time" },
  location: { type: String, required: true, trim: true, maxlength: 160 },
  applicationDate: { type: String, required: true },
  jobUrl: { type: String, trim: true, default: "", maxlength: 2048 },
  salary: { type: String, trim: true, default: "", maxlength: 100 },
  status: { type: String, enum: ["Applied", "Interview", "Shortlisted", "Offer", "Rejected", "Withdrawn"], default: "Applied" },
  notes: { type: String, trim: true, default: "", maxlength: 5000 },
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });

applicationSchema.set("toJSON", {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.user;
    return ret;
  },
});

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);
