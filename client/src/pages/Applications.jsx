import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createApplication,
  getApplications,
  updateApplication,
} from "../services/applicationService";
import ApplicationCard from "../components/applications/ApplicationCard";

const initialFormData = {
  jobTitle: "",
  company: "",
  jobType: "Full Time",
  location: "",
  applicationDate: "",
  jobUrl: "",
  salary: "",
  status: "Applied",
  notes: "",
};
const statusOptions = [
  "All",
  "Applied",
  "Interview",
  "Shortlisted",
  "Offer",
  "Rejected",
  "Withdrawn",
];
const jobTypeOptions = [
  "All",
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Remote",
];
const fieldClass = "form-input";

export default function Applications() {
  const [formData, setFormData] = useState(initialFormData);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [editingApplication, setEditingApplication] = useState(null);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const response = await getApplications();
      setApplications(
        Array.isArray(response) ? response : response?.applications || [],
      );
    } catch (error) {
      setFetchError(error.message || "Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial server data when this page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadApplications();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setSubmitError("");
    setNotice("");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingApplication(null);
    setSubmitError("");
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setFormData({
      ...initialFormData,
      ...application,
      salary: application.salary || "",
    });
    setSubmitError("");
    setNotice("");
    document
      .getElementById("application-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setNotice("");
    if (
      !formData.jobTitle.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.applicationDate
    ) {
      setSubmitError(
        "Please fill in Job Title, Company, Location, and Application Date.",
      );
      return;
    }
    try {
      setIsSubmitting(true);
      const response = editingApplication
        ? await updateApplication(editingApplication.id, formData)
        : await createApplication(formData);
      const saved = response?.application;
      if (saved) {
        setApplications((previous) =>
          editingApplication
            ? previous.map((item) =>
                item.id === editingApplication.id ? saved : item,
              )
            : [saved, ...previous],
        );
      } else {
        await loadApplications();
      }
      setNotice(
        editingApplication
          ? "Application updated successfully."
          : "Application added successfully.",
      );
      resetForm();
    } catch (error) {
      setSubmitError(
        error.message ||
          (editingApplication
            ? "Failed to update application."
            : "Failed to add application."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApplication = (id) =>
    setApplications((previous) => previous.filter((item) => item.id !== id));

  const filteredApplications = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    return applications.filter((application) => {
      const searchable = [
        application.jobTitle,
        application.company,
        application.location,
      ].some((value) => (value || "").toLowerCase().includes(search));
      return (
        searchable &&
        (statusFilter === "All" || application.status === statusFilter) &&
        (jobTypeFilter === "All" || application.jobType === jobTypeFilter)
      );
    });
  }, [applications, searchTerm, statusFilter, jobTypeFilter]);

  const hasActiveFilters = Boolean(
    searchTerm || statusFilter !== "All" || jobTypeFilter !== "All",
  );
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setJobTypeFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#423744]">
      <header className="border-b border-[#E8DDE7] bg-[#FFFCFA]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <Link
              to="/dashboard"
              className="text-sm font-bold text-[#72547D] hover:underline"
            >
              ← Dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Job Applications
            </h1>
            <p className="mt-1 text-sm text-[#5F5263]">
              Keep every opportunity organized and moving forward.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D77A73] bg-[#F7D9D5] px-6 py-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#824247]">
              Total applications
            </p>
            <p className="mt-1 text-3xl font-black">{applications.length}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section
          id="application-form"
          className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-[#E8DDE7] bg-[#F7E9DF] px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#68436D]">
                {editingApplication ? "Update details" : "Add to your pipeline"}
              </p>
              <h2 className="mt-1 text-xl font-black">
                {editingApplication
                  ? "Edit Application"
                  : "Add New Application"}
              </h2>
              <p className="mt-1 text-sm text-[#5F5263]">
                Fields marked * are required.
              </p>
            </div>
            <span className="w-fit rounded-full border border-[#D77A73] bg-[#FFFCFA] px-3 py-1.5 text-xs font-bold text-[#824247]">
              {editingApplication
                ? "Editing application"
                : "Track your progress"}
            </span>
          </div>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {submitError && (
              <p
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}
            {notice && (
              <p
                role="status"
                className="mb-4 rounded-xl border border-[#E9DDF1] bg-[#F1E8F8] px-4 py-3 text-sm font-semibold text-[#72547D]"
              >
                {notice}
              </p>
            )}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-2 block text-sm font-bold"
                >
                  Job Title *
                </label>
                <input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="MERN Stack Developer"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-bold"
                >
                  Company *
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Infosys"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-bold"
                >
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ahmedabad / Remote"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="jobType"
                  className="mb-2 block text-sm font-bold"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {jobTypeOptions
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="applicationDate"
                  className="mb-2 block text-sm font-bold"
                >
                  Application Date *
                </label>
                <input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={formData.applicationDate}
                  onChange={handleChange}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-bold"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  {statusOptions
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="salary"
                  className="mb-2 block text-sm font-bold"
                >
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="₹4–6 LPA"
                  className={fieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="jobUrl"
                  className="mb-2 block text-sm font-bold"
                >
                  Job Posting URL
                </label>
                <input
                  id="jobUrl"
                  name="jobUrl"
                  type="url"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  placeholder="https://company.com/careers/..."
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="notes" className="mb-2 block text-sm font-bold">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Recruiter details, interview notes, follow-up date..."
                className={`${fieldClass} resize-y`}
              />
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {editingApplication && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[#E8DDE7] px-5 py-3 text-sm font-bold hover:bg-[#F7E9DF] disabled:opacity-60"
                >
                  Cancel edit
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#80558F] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#A47BB4]/20 transition hover:-translate-y-0.5 hover:bg-[#8F668F] disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingApplication
                    ? "Update application →"
                    : "Add application →"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.17em] text-[#68436D]">
                Career pipeline
              </p>
              <h2 className="mt-2 text-2xl font-black">Your Applications</h2>
              <p className="mt-1 text-sm text-[#5F5263]">
                Find, filter, and manage your opportunities.
              </p>
            </div>
            <p className="w-fit rounded-full border border-[#E8DDE7] bg-[#FFFCFA] px-4 py-2 text-sm">
              <b>{filteredApplications.length}</b>
              <span className="mx-2 text-[#9C909B]">/</span>
              <span className="text-[#5F5263]">
                {applications.length} results
              </span>
            </p>
          </div>
          <div className="mt-6 rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black">Search & Filter</h3>
                <p className="mt-1 text-sm text-[#5F5263]">
                  Search by job title, company, or location.
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-fit rounded-lg border border-[#E8DDE7] px-3 py-2 text-xs font-bold hover:bg-[#F7E9DF]"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search applications..."
              className={`${fieldClass} mt-5`}
            />
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#5F5263]">
                  Application status
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full border px-3 py-2 text-xs font-bold transition ${statusFilter === status ? "border-[#8F668F] bg-[#80558F] text-white" : "border-[#E8DDE7] bg-[#FFFCFA] text-[#5F5263] hover:border-[#A47BB4]"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#5F5263]">
                  Job type
                </p>
                <div className="flex flex-wrap gap-2">
                  {jobTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setJobTypeFilter(type)}
                      className={`rounded-full border px-3 py-2 text-xs font-bold transition ${jobTypeFilter === type ? "border-[#D77A73] bg-[#D77A73] text-[#423744]" : "border-[#E8DDE7] bg-[#FFFCFA] text-[#5F5263] hover:border-[#D77A73]"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 border-t border-[#E8DDE7] pt-4 text-sm text-[#5F5263]">
              Showing{" "}
              <b className="text-[#423744]">{filteredApplications.length}</b> of{" "}
              <b className="text-[#423744]">{applications.length}</b>{" "}
              applications{hasActiveFilters ? " · Filters applied" : ""}
            </div>
          </div>

          {isLoading && (
            <div className="mt-8 rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#E9DDF1] border-t-[#8F668F]" />
              <p className="mt-4 text-sm text-[#5F5263]">
                Loading your applications...
              </p>
            </div>
          )}
          {!isLoading && fetchError && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <h3 className="font-black text-red-800">
                Unable to load applications
              </h3>
              <p className="mt-2 text-sm text-red-700">{fetchError}</p>
              <button
                onClick={loadApplications}
                className="mt-4 rounded-lg bg-[#FFFCFA] px-4 py-2 text-sm font-bold text-red-700"
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !fetchError && applications.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-[#E8DDE7] bg-[#FFFCFA] p-12 text-center">
              <div className="text-4xl">▤</div>
              <h3 className="mt-4 text-xl font-black">
                Your pipeline is empty
              </h3>
              <p className="mt-2 text-sm text-[#5F5263]">
                Add your first job application above to get started.
              </p>
            </div>
          )}
          {!isLoading &&
            !fetchError &&
            applications.length > 0 &&
            filteredApplications.length === 0 && (
              <div className="mt-8 rounded-3xl border border-dashed border-[#E8DDE7] bg-[#FFFCFA] p-10 text-center">
                <h3 className="text-xl font-black">No matching applications</h3>
                <p className="mt-2 text-sm text-[#5F5263]">
                  Try another keyword or clear your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-[#80558F] px-4 py-2 text-sm font-bold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          {!isLoading && !fetchError && filteredApplications.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onDelete={handleDeleteApplication}
                  onEdit={handleEditApplication}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
