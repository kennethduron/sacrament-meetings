import Link from "next/link";

export const metadata = {
  title: "Create Meeting",
};

export default function NewMeetingPlaceholder() {
  return (
    <section className="status-panel">
      <p className="eyebrow">Administration preview</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">
        Create Meeting - Coming in Week 04
      </h1>
      <p className="mt-3 max-w-2xl text-slate-700">
        Meeting creation is not part of this week&apos;s assignment. This route is a placeholder for the next development stage.
      </p>
      <Link className="button button-secondary mt-6" href="/meetings">
        Return to public meetings
      </Link>
    </section>
  );
}
