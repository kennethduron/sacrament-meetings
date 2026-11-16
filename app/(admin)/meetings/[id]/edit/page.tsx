import Link from "next/link";
import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";

export const metadata = { title: "Edit Meeting" };
export const instant = false;

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) notFound();
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) notFound();
  const meeting = await getMeetingById(id);
  if (!meeting) notFound();

  return (
    <section className="space-y-8">
      <header className="section-heading">
        <p className="eyebrow">Administration · Sample record {meeting.id}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">Edit meeting</h1>
        <p className="mt-3 max-w-2xl text-slate-700">Update this fictional example. A date already used by another record cannot be saved.</p>
      </header>
      <div className="demo-banner" role="note"><strong>Course demo:</strong> use fictional names and meeting details only.</div>
      <MeetingForm action={updateMeeting.bind(null, meeting.id)} meeting={meeting} />
      <Link className="inline-link" href={`/meetings/${meeting.id}`}>Return to meeting details</Link>
    </section>
  );
}
