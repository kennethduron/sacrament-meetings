import Image from "next/image";
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Find a Sunday",
    description: "Browse the schedule by date, including past programs and Sundays without a ward sacrament meeting.",
  },
  {
    number: "02",
    title: "Review the agenda",
    description: "See leadership, announcements, hymns, prayers, ward business, speakers, and musical numbers in order.",
  },
  {
    number: "03",
    title: "Print a program",
    description: "Open a clean, paper-friendly view that keeps the meeting details easy to follow.",
  },
];

export default function Home() {
  return (
    <>
      <section className="page-shell grid flex-1 items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">A thoughtful Sunday, clearly planned</p>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-navy-950 sm:text-6xl">
            Plan the meeting.<br />
            <span className="text-navy-700">Be present for it.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            A simple place to review sacrament meeting schedules, follow the program, and keep past Sunday examples close at hand.
          </p>
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            Coursework demo: this planner uses fictional names and sample program details only.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="button button-primary" href="/meetings/current">View this Sunday <span aria-hidden="true">→</span></Link>
            <Link className="button button-secondary" href="/meetings">Explore the archive</Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
            <span><strong className="text-navy-900">5</strong> sample Sundays</span>
            <span><strong className="text-navy-900">4</strong> meeting types</span>
            <span>Printable agenda view</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div aria-hidden="true" className="absolute -left-5 -top-5 h-24 w-24 rounded-full border border-amber-300/70" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-soft">
            <Image
              alt="Original illustration of a quiet chapel beneath a morning sky"
              className="h-auto w-full"
              height={820}
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              src="/meeting-illustration.svg"
              width={1200}
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-sm sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">
              <p className="eyebrow">A sample program</p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-navy-950">Sunday Sacrament Meeting</p>
                  <p className="mt-1 text-sm text-slate-600">A clear order for a meaningful gathering</p>
                </div>
                <span className="type-badge type-badge-meeting">Example Ward</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-right text-xs text-slate-500">Original local illustration · fictional setting</p>
        </div>
      </section>

      <section aria-labelledby="features-title" className="bg-white py-14 sm:py-16">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Designed around the program</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy-950" id="features-title">Everything in its place</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
