import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <section className="status-panel" role="status">
      <p className="eyebrow">Meeting not found</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">This meeting is not in the sample archive</h1>
      <p className="mt-2">It may have been removed, or the ID may be invalid.</p>
      <Link className="button button-secondary mt-5" href="/meetings">Return to meetings</Link>
    </section>
  );
}
