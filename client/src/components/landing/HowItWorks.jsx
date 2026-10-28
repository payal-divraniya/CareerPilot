const steps = [
  {
    number: "01",
    title: "Create your account",
    text: "Register and sign in to open your personal job-tracking workspace.",
  },
  {
    number: "02",
    title: "Add opportunities",
    text: "Save the role, company, location, application date, link, and any notes you need.",
  },
  {
    number: "03",
    title: "Keep your progress updated",
    text: "Change statuses as you move through applications, interviews, and offers.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[#F7E9DF] px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#68436D]">
            Three simple steps
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            From scattered tabs to a clear plan
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-3xl border border-[#E8DDE7] bg-[#FFFCFA] p-7"
            >
              <p className="text-sm font-black tracking-[.18em] text-[#944B46]">
                {step.number}
              </p>
              <h3 className="mt-4 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-3 leading-7 text-[#5F5263]">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
