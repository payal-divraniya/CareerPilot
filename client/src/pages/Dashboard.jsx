import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApplications } from "../services/applicationService";

const statusStyle = {
  Applied: "bg-[#F7E9DF] text-[#8B6B61]",
  Interview: "bg-[#E9DDF1] text-[#72547D]",
  Shortlisted: "bg-[#F7D9D5] text-[#824247]",
  Offer: "bg-[#E9DDF1] text-[#72547D]",
  Rejected: "bg-[#FBE7E4] text-[#B24F55]",
  Withdrawn: "bg-[#F0E9EE] text-[#5F5263]",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoadingApplications(true);
      setApplicationsError("");
      const response = await getApplications();
      setApplications(
        Array.isArray(response) ? response : response?.applications || [],
      );
    } catch (error) {
      setApplicationsError(
        error.message || "Unable to load your applications.",
      );
    } finally {
      setIsLoadingApplications(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial server data and refresh when the browser tab regains focus.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplications();
    window.addEventListener("focus", fetchApplications);
    return () => window.removeEventListener("focus", fetchApplications);
  }, [fetchApplications]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login");
  };

  const firstName = user?.name?.split(" ")[0] || "there";
  const total = applications.length;
  const interviews = applications.filter(
    (item) => item.status === "Interview",
  ).length;
  const offers = applications.filter((item) => item.status === "Offer").length;
  const rejected = applications.filter(
    (item) => item.status === "Rejected",
  ).length;
  const stats = [
    {
      title: "Applications",
      value: total,
      description: "All tracked opportunities",
      icon: "▤",
      tone: "bg-[#F7D9D5] text-[#824247]",
    },
    {
      title: "Interviews",
      value: interviews,
      description: "Interview stage",
      icon: "◎",
      tone: "bg-[#E9DDF1] text-[#72547D]",
    },
    {
      title: "Rejected",
      value: rejected,
      description: "Applications closed out",
      icon: "↘",
      tone: "bg-[#FBE7E4] text-[#B24F55]",
    },
    {
      title: "Offers",
      value: offers,
      description: "Offers received",
      icon: "✦",
      tone: "bg-[#E9DDF1] text-[#72547D]",
    },
  ];
  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.applicationDate || 0) -
            new Date(a.createdAt || a.applicationDate || 0),
        )
        .slice(0, 4),
    [applications],
  );

  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#423744]">
      <header className="sticky top-0 z-40 border-b border-[#E8DDE7] bg-[#FFFCFA]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#80558F] text-lg font-black text-white">
              C
            </span>
            <span>
              <b className="block text-lg">CareerPilot</b>
              <small className="hidden text-[10px] font-bold uppercase tracking-widest text-[#5F5263] sm:block">
                Job Application Tracker
              </small>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#F7D9D5] font-black text-[#824247]">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <div>
                <p className="text-sm font-bold">{user?.name || "User"}</p>
                <p className="text-xs text-[#5F5263]">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#E8DDE7] px-4 py-2 text-sm font-bold transition hover:border-[#D77A73] hover:bg-[#F7D9D5]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="animate-fade-up relative overflow-hidden rounded-4xl bg-[#72547D] px-6 py-9 text-white sm:px-9 sm:py-11">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full border border-white/10 bg-[#80558F]/20 blur-sm" />
          <div className="pointer-events-none absolute bottom-28 right-1/3 h-56 w-56 rounded-full bg-[#D77A73]/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-[#FFFCFA]/10 px-3 py-1.5 text-xs font-bold text-[#F1E8F8]">
                Your career command center
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                Welcome back,{" "}
                <span className="text-[#E9DDF1]">{firstName} 👋</span>
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/75">
                Keep your applications organized, follow your progress, and stay
                ready for your next opportunity.
              </p>
            </div>
            <Link
              to="/applications"
              className="w-fit rounded-xl bg-[#80558F] px-6 py-3.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8F668F]"
            >
              ＋ Add application
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <article
              key={stat.title}
              style={{ animationDelay: `${index * 70}ms` }}
              className="animate-fade-up rounded-2xl border border-[#E8DDE7] bg-[#FFFCFA] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#5F5263]">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {isLoadingApplications ? "…" : stat.value}
                  </p>
                  <p className="mt-2 text-xs text-[#9C909B]">
                    {stat.description}
                  </p>
                </div>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl text-xl font-black ${stat.tone}`}
                >
                  {stat.icon}
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_.8fr]">
          <div className="overflow-hidden rounded-2xl border border-[#E8DDE7] bg-[#FFFCFA]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E8DDE7] px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-lg font-black">Recent Applications</h2>
                <p className="mt-1 text-sm text-[#5F5263]">
                  Your latest job-search activity.
                </p>
              </div>
              <Link
                to="/applications"
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-[#72547D] hover:bg-[#E9DDF1]"
              >
                View all →
              </Link>
            </div>
            <div className="min-h-65 p-5 sm:p-6">
              {isLoadingApplications ? (
                <p className="py-16 text-center text-sm text-[#5F5263]">
                  Loading your applications...
                </p>
              ) : applicationsError ? (
                <div className="py-12 text-center">
                  <p className="font-bold text-red-700">{applicationsError}</p>
                  <button
                    onClick={fetchApplications}
                    className="mt-3 rounded-lg border border-[#E8DDE7] px-4 py-2 text-sm font-bold"
                  >
                    Try again
                  </button>
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-4xl">▤</div>
                  <h3 className="mt-4 font-black">No applications yet</h3>
                  <p className="mt-2 text-sm text-[#5F5263]">
                    Add your first opportunity to get started.
                  </p>
                  <Link
                    to="/applications"
                    className="mt-4 inline-flex rounded-xl bg-[#80558F] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Add application
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((application) => (
                    <article
                      key={application.id}
                      className="flex flex-col justify-between gap-3 rounded-xl border border-[#E8DDE7] p-4 transition hover:border-[#D77A73] hover:bg-[#FFF7F1] sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-extrabold">
                          {application.jobTitle || "Untitled position"}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#68436D]">
                          {application.company || "Company not specified"}
                        </p>
                        <p className="mt-1 text-xs text-[#5F5263]">
                          {application.location || "Location not specified"} ·{" "}
                          {application.applicationDate || "Date not specified"}
                        </p>
                      </div>
                      <span
                        className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyle[application.status] || statusStyle.Applied}`}
                      >
                        {application.status || "Applied"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
          <aside className="rounded-2xl border border-[#E8DDE7] bg-[#FFFCFA] p-5 sm:p-6">
            <h2 className="text-lg font-black">Quick Actions</h2>
            <p className="mt-1 text-sm text-[#5F5263]">
              Keep your job search moving.
            </p>
            <div className="mt-5 space-y-3">
              <Link
                to="/applications"
                className="flex items-center gap-3 rounded-xl border border-[#E8DDE7] p-4 transition hover:border-[#A47BB4] hover:bg-[#F1E8F8]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E9DDF1] font-black text-[#72547D]">
                  ＋
                </span>
                <span className="flex-1">
                  <b className="block text-sm">Add application</b>
                  <small className="text-xs text-[#5F5263]">
                    Save a new opportunity
                  </small>
                </span>
                <span>→</span>
              </Link>
              <Link
                to="/applications"
                className="flex items-center gap-3 rounded-xl border border-[#E8DDE7] p-4 transition hover:border-[#D77A73] hover:bg-[#FBE7E4]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F7D9D5] font-black text-[#824247]">
                  ⌕
                </span>
                <span className="flex-1">
                  <b className="block text-sm">Find an application</b>
                  <small className="text-xs text-[#5F5263]">
                    Search and filter your list
                  </small>
                </span>
                <span>→</span>
              </Link>
            </div>
            <div className="mt-5 rounded-xl bg-[#F7E9DF] p-4">
              <p className="text-sm font-extrabold">A small next step</p>
              <p className="mt-1 text-sm leading-6 text-[#5F5263]">
                Review one application today and make sure its status and notes
                are up to date.
              </p>
            </div>
          </aside>
        </section>
      </main>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#654A70]/50 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-md rounded-3xl border border-[#D9CBE8] bg-[#FFF9F4] p-7 shadow-2xl"
          >
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#F7D9D5] text-2xl text-[#824247]">
              ↪
            </div>

            <h2
              id="logout-title"
              className="text-center text-2xl font-black text-[#654A70]"
            >
              Confirm Logout
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-[#5F5263]">
              Are you sure you want to log out of your CareerPilot account?
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-[#D9CBE8] bg-[#F8F3FC] px-4 py-3 font-semibold text-[#654A70] transition hover:bg-[#EDE2F5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-[#C98283] px-4 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B86D73] active:scale-[0.98]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
