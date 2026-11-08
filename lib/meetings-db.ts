import type { SacramentMeeting } from "@/lib/types";

const notApplicableHymn = { number: 0, title: "" };

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-11-08",
    meetingType: "regular",
    presiding: "Jordan Sample",
    conducting: "Morgan Example",
    announcements: [
      "Example notice: the service project sign-up closes next Sunday.",
      "Example notice: the youth music rehearsal begins at 4:00 p.m.",
    ],
    openingHymn: { number: 1, title: "A Sabbath Morning (sample hymn)" },
    openingPrayer: "Taylor Fiction",
    wardBusiness: [
      { description: "Example: sustain the proposed Primary activity leader." },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 2, title: "Remembering the Savior (sample hymn)" },
    speakers: [
      {
        name: "Casey Sample",
        topic: "Finding peace through daily discipleship",
        type: "speaker",
      },
      {
        name: "Avery Fiction",
        topic: "Small acts of service",
        type: "speaker",
      },
    ],
    closingHymn: { number: 3, title: "Walk in the Light (sample hymn)" },
    closingPrayer: "Riley Example",
  },
  {
    id: 2,
    date: "2026-11-01",
    meetingType: "testimony",
    presiding: "Jordan Sample",
    conducting: "Morgan Example",
    announcements: ["Example notice: November ministering interviews are available."],
    openingHymn: { number: 4, title: "Come with a Willing Heart (sample hymn)" },
    openingPrayer: "Taylor Fiction",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 5, title: "In Remembrance (sample hymn)" },
    speakers: [
      {
        name: "Members of the congregation (sample)",
        topic: "Personal testimonies",
        type: "speaker",
      },
    ],
    closingHymn: { number: 6, title: "A Quiet Prayer (sample hymn)" },
    closingPrayer: "Avery Fiction",
  },
  {
    id: 3,
    date: "2026-10-25",
    meetingType: "stake",
    presiding: "Not applicable to a ward sacrament program",
    conducting: "Not applicable to a ward sacrament program",
    openingHymn: notApplicableHymn,
    openingPrayer: "",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: notApplicableHymn,
    speakers: [],
    closingHymn: notApplicableHymn,
    closingPrayer: "",
  },
  {
    id: 4,
    date: "2026-10-18",
    meetingType: "general",
    presiding: "Not applicable to a ward sacrament program",
    conducting: "Not applicable to a ward sacrament program",
    openingHymn: notApplicableHymn,
    openingPrayer: "",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: notApplicableHymn,
    speakers: [],
    closingHymn: notApplicableHymn,
    closingPrayer: "",
  },
  {
    id: 5,
    date: "2026-10-11",
    meetingType: "regular",
    presiding: "Jordan Sample",
    conducting: "Morgan Example",
    announcements: [],
    openingHymn: { number: 7, title: "A Place of Welcome (sample hymn)" },
    openingPrayer: "Riley Example",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 8, title: "The Shepherd's Care (sample hymn)" },
    speakers: [
      {
        name: "Casey Sample",
        topic: "Covenants and community",
        type: "speaker",
      },
      {
        name: "Sample Ward Choir",
        topic: "A musical reflection (sample)",
        type: "musical-number",
      },
    ],
    closingHymn: { number: 9, title: "Hope for the Journey (sample hymn)" },
    closingPrayer: "Taylor Fiction",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  const orderedMeetings = [...meetings].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  if (date) {
    return orderedMeetings.filter((meeting) => meeting.date === date);
  }

  return orderedMeetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((meeting) => meeting.id === id) ?? null;
}
