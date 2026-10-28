const features = [
  {
    icon: "▤",
    title: "One organized list",
    text: "Keep company names, job titles, locations, links, salary notes, and dates together.",
  },
  {
    icon: "◎",
    title: "Clear application stages",
    text: "Know what is applied, shortlisted, in interview, offered, rejected, or withdrawn.",
  },
  {
    icon: "⌕",
    title: "Quick search and filters",
    text: "Find the right opportunity by keyword, status, or job type without scrolling endlessly.",
  },
  {
    icon: "▥",
    title: "Progress at a glance",
    text: "See application totals, interviews, offers, and your current job-search progress.",
  },
  {
    icon: "✎",
    title: "Useful personal notes",
    text: "Save recruiter details, interview notes, and follow-up reminders alongside each role.",
  },
  {
    icon: "⌂",
    title: "Your own workspace",
    text: "Sign in to manage your job search in a personal account.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#68436D]">
            Everything in one place
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            A simple system for a busy search
          </h2>
          <p className="mt-4 leading-7 text-[#5F5263]">
            Spend less time trying to remember details and more time preparing
            for your next step.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D77A73] hover:shadow-xl hover:shadow-[#9A849B]/10"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl text-xl font-black ${index % 2 === 0 ? "bg-[#F7D9D5] text-[#824247]" : "bg-[#E9DDF1] text-[#72547D]"}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-extrabold">{feature.title}</h3>
              <p className="mt-2 leading-7 text-[#5F5263]">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
