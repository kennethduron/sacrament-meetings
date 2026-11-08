import MeetingsList from "@/components/MeetingsList";

export default function MeetingsPage() {
  return (
    <>
      <header className="section-heading">
        <p className="eyebrow">The schedule archive</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-950 sm:text-5xl">
          Meetings & programs
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Browse current and previous Sunday examples. Select a sacrament meeting to read or print its program.
        </p>
      </header>
      <div className="mt-9"><MeetingsList /></div>
    </>
  );
}
