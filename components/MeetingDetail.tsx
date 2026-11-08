import type { ReactNode } from "react";
import { formatMeetingDate } from "@/lib/date-utils";
import { isSacramentMeeting, meetingTypeLabel, type SacramentMeeting } from "@/lib/types";
import PrintProgramButton from "@/components/PrintProgramButton";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

function AgendaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="agenda-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const includesSacrament = isSacramentMeeting(meeting.meetingType);

  return (
    <article className="program-sheet">
      <div className="program-heading">
        <div>
          <p className="eyebrow">Example Ward · fictional sample program</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
            {meeting.meetingType === "testimony"
              ? "Testimony Meeting"
              : meeting.meetingType === "regular"
                ? "Sacrament Meeting"
                : meeting.meetingType === "stake"
                  ? "Stake Sunday"
                  : "General Conference Sunday"}
          </h1>
          <p className="mt-2 text-lg text-slate-600">{formatMeetingDate(meeting.date)}</p>
        </div>
        <PrintProgramButton />
      </div>

      {!includesSacrament ? (
        <section aria-labelledby="no-program-heading" className="notice-panel mt-8">
          <p className="eyebrow">Sunday schedule</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-navy-950" id="no-program-heading">
            No ward sacrament meeting is scheduled
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {meetingTypeLabel(meeting.meetingType)}. This sample intentionally does not display sacrament hymns, prayers, or speakers for this date.
          </p>
        </section>
      ) : (
        <>
          <section aria-label="Meeting leadership" className="leadership-grid mt-8">
            <div><span>Presiding</span><strong>{meeting.presiding}</strong></div>
            <div><span>Conducting</span><strong>{meeting.conducting}</strong></div>
          </section>

          <div className="agenda-content mt-8">
            {meeting.announcements && meeting.announcements.length > 0 && (
              <section className="agenda-section">
                <h2>Announcements</h2>
                <ul className="agenda-list">
                  {meeting.announcements.map((announcement) => <li key={announcement}>{announcement}</li>)}
                </ul>
              </section>
            )}

            <dl className="agenda-list divide-y divide-slate-200">
              <AgendaRow label="Opening hymn">#{meeting.openingHymn.number} · {meeting.openingHymn.title}</AgendaRow>
              <AgendaRow label="Opening prayer">{meeting.openingPrayer}</AgendaRow>
              {meeting.wardBusiness.length > 0 && (
                <AgendaRow label="Ward business">
                  <ul className="list-inside list-disc space-y-1">
                    {meeting.wardBusiness.map((item) => <li key={item.description}>{item.description}</li>)}
                  </ul>
                </AgendaRow>
              )}
              <AgendaRow label="Stake business">
                {meeting.stakeBusiness ? "Stake business is scheduled" : "No stake business listed"}
              </AgendaRow>
              <AgendaRow label="Sacrament hymn">#{meeting.sacramentHymn.number} · {meeting.sacramentHymn.title}</AgendaRow>
              {meeting.speakers.map((item, index) => (
                <AgendaRow key={`${item.name}-${index}`} label={item.type === "speaker" ? "Speaker" : "Musical number"}>
                  <span className="font-semibold">{item.name}</span>{item.topic ? ` · ${item.topic}` : ""}
                </AgendaRow>
              ))}
              <AgendaRow label="Closing hymn">#{meeting.closingHymn.number} · {meeting.closingHymn.title}</AgendaRow>
              <AgendaRow label="Closing prayer">{meeting.closingPrayer}</AgendaRow>
            </dl>
          </div>
        </>
      )}

      <p className="sample-notice mt-8">For coursework demonstration only. All names, announcements, and hymn titles in this program are fictional sample data.</p>
    </article>
  );
}
