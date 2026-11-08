import Link from "next/link";
import { formatMeetingDate } from "@/lib/date-utils";
import { isSacramentMeeting, meetingTypeLabel, type SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const includesSacrament = isSacramentMeeting(meeting.meetingType);

  return (
    <article className="meeting-card group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{formatMeetingDate(meeting.date)}</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-navy-950">
            {meeting.meetingType === "testimony"
              ? "Testimony Meeting"
              : meeting.meetingType === "regular"
                ? "Sunday Sacrament Meeting"
                : meeting.meetingType === "stake"
                  ? "Stake Sunday"
                  : "General Conference Sunday"}
          </h2>
        </div>
        <span className={`type-badge ${includesSacrament ? "type-badge-meeting" : "type-badge-observance"}`}>
          {includesSacrament ? "Sacrament meeting" : "No ward sacrament meeting"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {includesSacrament
          ? `${meeting.speakers.length} program item${meeting.speakers.length === 1 ? "" : "s"} · Presiding: ${meeting.presiding}`
          : `${meetingTypeLabel(meeting.meetingType)}. No sacrament program is listed.`}
      </p>

      <Link
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 group-hover:text-navy-600"
        href={`/meetings/${meeting.id}`}
      >
        View meeting details <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
