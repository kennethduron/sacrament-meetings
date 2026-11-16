import { z } from "zod";
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from "./types";

const meetingTypes = ["testimony", "regular", "stake", "general", "special"] as const;
const programTypes: MeetingType[] = ["testimony", "regular", "special"];

export const meetingFormSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid meeting date."),
  meetingType: z.enum(meetingTypes),
  presiding: z.string().trim().max(255, "Use 255 characters or fewer."),
  conducting: z.string().trim().max(255, "Use 255 characters or fewer."),
  announcements: z.string().max(4000, "Use 4,000 characters or fewer."),
  openingHymnNumber: z.string().trim(),
  openingHymnTitle: z.string().trim().max(255, "Use 255 characters or fewer."),
  openingPrayer: z.string().trim().max(255, "Use 255 characters or fewer."),
  wardBusiness: z.string().max(4000, "Use 4,000 characters or fewer."),
  stakeBusiness: z.enum(["on", ""]).optional(),
  sacramentHymnNumber: z.string().trim(),
  sacramentHymnTitle: z.string().trim().max(255, "Use 255 characters or fewer."),
  speakers: z.string().max(4000, "Use 4,000 characters or fewer."),
  closingHymnNumber: z.string().trim(),
  closingHymnTitle: z.string().trim().max(255, "Use 255 characters or fewer."),
  closingPrayer: z.string().trim().max(255, "Use 255 characters or fewer."),
}).superRefine((value, context) => {
  const parsedDate = new Date(`${value.date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== value.date) {
    context.addIssue({ code: "custom", path: ["date"], message: "Enter a real calendar date." });
  }

  const hasProgram = programTypes.includes(value.meetingType);
  if (hasProgram) {
    if (!value.presiding) context.addIssue({ code: "custom", path: ["presiding"], message: "Enter the presiding person." });
    if (!value.conducting) context.addIssue({ code: "custom", path: ["conducting"], message: "Enter the conducting person." });

    for (const [field, number, title] of [
      ["openingHymnNumber", value.openingHymnNumber, value.openingHymnTitle],
      ["sacramentHymnNumber", value.sacramentHymnNumber, value.sacramentHymnTitle],
      ["closingHymnNumber", value.closingHymnNumber, value.closingHymnTitle],
    ] as const) {
      if (!/^[1-9]\d{0,3}$/.test(number)) {
        context.addIssue({ code: "custom", path: [field], message: "Enter a hymn number from 1 to 9999." });
      }
      if (!title) context.addIssue({ code: "custom", path: [field.replace("Number", "Title")], message: "Enter the hymn title." });
    }
  }

  value.speakers.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line, index) => {
    const [name, topic, type, ...extra] = line.split("|").map((part) => part.trim());
    if (!name || !topic || !["speaker", "musical-number"].includes(type ?? "") || extra.length > 0) {
      context.addIssue({
        code: "custom",
        path: ["speakers"],
        message: `Line ${index + 1} must use: Name | topic | speaker or musical-number.`,
      });
    }
    if (name && name.length > 255) {
      context.addIssue({ code: "custom", path: ["speakers"], message: `Name on line ${index + 1} is too long.` });
    }
  });
});

export type MeetingFormValues = z.infer<typeof meetingFormSchema>;

export function readMeetingForm(formData: FormData): MeetingFormValues {
  const read = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    date: read("date"),
    meetingType: read("meetingType") as MeetingType,
    presiding: read("presiding"),
    conducting: read("conducting"),
    announcements: read("announcements"),
    openingHymnNumber: read("openingHymnNumber"),
    openingHymnTitle: read("openingHymnTitle"),
    openingPrayer: read("openingPrayer"),
    wardBusiness: read("wardBusiness"),
    stakeBusiness: formData.get("stakeBusiness") === "on" ? "on" : "",
    sacramentHymnNumber: read("sacramentHymnNumber"),
    sacramentHymnTitle: read("sacramentHymnTitle"),
    speakers: read("speakers"),
    closingHymnNumber: read("closingHymnNumber"),
    closingHymnTitle: read("closingHymnTitle"),
    closingPrayer: read("closingPrayer"),
  };
}

export function toMeetingData(value: MeetingFormValues): Omit<SacramentMeeting, "id"> {
  const hasProgram = programTypes.includes(value.meetingType);
  const hymn = (number: string, title: string): Hymn => ({
    number: hasProgram ? Number(number) : 0,
    title: hasProgram ? title.trim() : "",
  });
  const speakers: SpeakerItem[] = hasProgram
    ? value.speakers.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [name, topic, type] = line.split("|").map((part) => part.trim());
      return { name, topic, type: type as SpeakerItem["type"] };
    })
    : [];
  const wardBusiness: WardBusinessItem[] = value.wardBusiness
    .split(/\r?\n/).map((description) => description.trim()).filter(Boolean)
    .map((description) => ({ description }));

  return {
    date: value.date,
    meetingType: value.meetingType,
    presiding: hasProgram ? value.presiding.trim() : "Not applicable to a ward sacrament program",
    conducting: hasProgram ? value.conducting.trim() : "Not applicable to a ward sacrament program",
    announcements: value.announcements.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
    openingHymn: hymn(value.openingHymnNumber, value.openingHymnTitle),
    openingPrayer: hasProgram ? value.openingPrayer.trim() : "",
    wardBusiness,
    stakeBusiness: value.stakeBusiness === "on",
    sacramentHymn: hymn(value.sacramentHymnNumber, value.sacramentHymnTitle),
    speakers,
    closingHymn: hymn(value.closingHymnNumber, value.closingHymnTitle),
    closingPrayer: hasProgram ? value.closingPrayer.trim() : "",
  };
}

export function toMeetingFormValues(meeting: SacramentMeeting): MeetingFormValues {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding === "Not applicable to a ward sacrament program" ? "" : meeting.presiding,
    conducting: meeting.conducting === "Not applicable to a ward sacrament program" ? "" : meeting.conducting,
    announcements: (meeting.announcements ?? []).join("\n"),
    openingHymnNumber: meeting.openingHymn.number ? String(meeting.openingHymn.number) : "",
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness.map((item) => item.description).join("\n"),
    stakeBusiness: meeting.stakeBusiness ? "on" : "",
    sacramentHymnNumber: meeting.sacramentHymn.number ? String(meeting.sacramentHymn.number) : "",
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map((item) => `${item.name} | ${item.topic} | ${item.type}`).join("\n"),
    closingHymnNumber: meeting.closingHymn.number ? String(meeting.closingHymn.number) : "",
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

export function getMeetingFormErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] = [...(errors[field] ?? []), issue.message];
  }
  return errors;
}
