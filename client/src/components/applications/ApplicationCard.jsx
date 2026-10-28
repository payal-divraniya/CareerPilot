import { toast } from "react-toastify";
import { deleteApplication } from "../../services/applicationService";

const statusStyles = {
  Applied: "bg-[#F7E9DF] text-[#8B6B61]",
  Interview: "bg-[#E9DDF1] text-[#72547D]",
  Shortlisted: "bg-[#F7D9D5] text-[#824247]",
  Offer: "bg-[#E9DDF1] text-[#72547D]",
  Rejected: "bg-[#FBE7E4] text-[#B24F55]",
  Withdrawn: "bg-[#F0E9EE] text-[#5F5263]",
};

export default function ApplicationCard({ application, onDelete, onEdit }) {
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete the application for ${application.jobTitle || "this role"} at ${application.company || "this company"}?`,
      )
    )
      return;
    try {
      await deleteApplication(application.id);
      onDelete(application.id);
    } catch (error) {
      toast.error(error.message || "Could not delete this application.");
    }
  };

  return (
    <article className="rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D77A73] hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold">
            {application.jobTitle || "Untitled position"}
          </h3>
          <p className="mt-1 font-semibold text-[#68436D]">
            {application.company || "Company not specified"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[application.status] || statusStyles.Applied}`}
        >
          {application.status || "Applied"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#5F5263]">
        <span>⌖ {application.location || "Location not specified"}</span>
        <span>▦ {application.jobType || "Full Time"}</span>
        <span>◷ {application.applicationDate || "Date not specified"}</span>
      </div>
      {application.salary && (
        <p className="mt-3 text-sm font-semibold">
          Salary:{" "}
          <span className="font-medium text-[#5F5263]">
            {application.salary}
          </span>
        </p>
      )}
      {application.notes && (
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-[#F7E9DF] p-3 text-sm leading-6 text-[#5F5263]">
          {application.notes}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8DDE7] pt-4">
        {application.jobUrl ? (
          <a
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-[#72547D] underline-offset-4 hover:underline"
          >
            View job posting ↗
          </a>
        ) : (
          <span className="text-xs text-[#9C909B]">No job link added</span>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="rounded-lg border border-[#E8DDE7] px-3 py-2 text-sm font-bold hover:bg-[#F7E9DF]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-[#E7CACA] px-3 py-2 text-sm font-bold text-[#B24F55] hover:bg-[#FBE7E4]"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
