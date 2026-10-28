import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
      <div className="pointer-events-none absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#F7D9D5] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#D77A73]/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D77A73] bg-[#FFFCFA]/70 px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-[#824247]">
            <span className="h-2 w-2 rounded-full bg-[#80558F]" /> A calmer way
            to job hunt
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
            Your next opportunity,{" "}
            <span className="text-[#68436D]">all in one place.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#5F5263] sm:text-lg">
            Keep track of applications, interview stages, follow-ups, and job
            details with one simple workspace built for your career journey.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-[#80558F] px-6 py-3.5 text-center font-bold text-white shadow-lg shadow-[#A47BB4]/20 transition hover:-translate-y-0.5 hover:bg-[#8F668F]"
            >
              Start tracking for free →
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-[#E8DDE7] bg-[#FFFCFA] px-6 py-3.5 text-center font-bold transition hover:border-[#A47BB4] hover:bg-[#F7E9DF]"
            >
              I already have an account
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#5F5263]">
            <span>✓ Application status tracking</span>
            <span>✓ Search and filters</span>
            <span>✓ Personal dashboard</span>
          </div>
        </div>
        <div className="animate-float rounded-4xl border border-white bg-[#FFFCFA]/80 p-4 shadow-2xl shadow-[#9A849B]/15 sm:p-6">
          <div className="rounded-3xl bg-[#F7E9DF] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#5F5263]">
                  Your job search
                </p>
                <h2 className="mt-1 text-2xl font-black">Progress overview</h2>
              </div>
              <span className="rounded-xl bg-[#E9DDF1] px-3 py-2 text-sm font-bold text-[#72547D]">
                On track
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["12", "Applied"],
                ["4", "Interviews"],
                ["1", "Offers"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-[#FFFCFA] p-4">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#625566]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-[#FFFCFA] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Frontend Developer</p>
                  <p className="mt-1 text-sm text-[#625566]">
                    Northstar Studio
                  </p>
                </div>
                <span className="rounded-full bg-[#F7D9D5] px-3 py-1 text-xs font-bold text-[#824247]">
                  Interview
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8DDE7]">
                <div className="h-full w-2/3 rounded-full bg-[#80558F]" />
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-dashed border-[#E8DDE7] p-4 text-sm text-[#5F5263]">
              A little organization goes a long way. Keep your next step
              visible.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
