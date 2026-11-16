import Link from "next/link";
import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export const metadata = {
  title: "Create Meeting",
};

export default function NewMeetingPage() {
  return (
    <section className="space-y-8">
      <header className="section-heading">
        <p className="eyebrow">Administration</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">
          Create a meeting
      </h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Add a fictional sample program to the archive. Each meeting must use a date that is not already in the database.
        </p>
      </header>
      <div className="demo-banner" role="note"><strong>Course demo:</strong> all names and program details entered here should be fictional.</div>
      <MeetingForm action={createMeeting} />
      <Link className="inline-link" href="/meetings">
        Return to public meetings
      </Link>
    </section>
  );
}
