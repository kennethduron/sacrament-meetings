import assert from "node:assert/strict";
import test from "node:test";
import { meetingFormSchema, toMeetingData } from "../lib/meeting-form.ts";

const regularMeeting = {
  date: "2026-12-06",
  meetingType: "regular",
  presiding: "Jordan Sample",
  conducting: "Morgan Example",
  announcements: "Fictional notice",
  openingHymnNumber: "12",
  openingHymnTitle: "Sample opening hymn",
  openingPrayer: "Taylor Fiction",
  wardBusiness: "Recognize a sample volunteer",
  stakeBusiness: "on",
  sacramentHymnNumber: "34",
  sacramentHymnTitle: "Sample sacrament hymn",
  speakers: "Casey Sample | Service | speaker\nSample Choir | Music | musical-number",
  closingHymnNumber: "56",
  closingHymnTitle: "Sample closing hymn",
  closingPrayer: "Avery Fiction",
};

test("valid regular meeting data maps to the database model", () => {
  const parsed = meetingFormSchema.safeParse(regularMeeting);
  assert.equal(parsed.success, true);
  if (!parsed.success) return;

  const result = toMeetingData(parsed.data);
  assert.equal(result.meetingType, "regular");
  assert.deepEqual(result.openingHymn, { number: 12, title: "Sample opening hymn" });
  assert.deepEqual(result.speakers[1], { name: "Sample Choir", topic: "Music", type: "musical-number" });
  assert.deepEqual(result.announcements, ["Fictional notice"]);
});

test("invalid calendar dates and hymn numbers are rejected", () => {
  const parsed = meetingFormSchema.safeParse({ ...regularMeeting, date: "2026-02-30", openingHymnNumber: "0" });
  assert.equal(parsed.success, false);
  if (parsed.success) return;

  const fields = parsed.error.issues.map((issue) => issue.path[0]);
  assert.ok(fields.includes("date"));
  assert.ok(fields.includes("openingHymnNumber"));
});

test("speaker rows require a supported type and the documented separators", () => {
  const parsed = meetingFormSchema.safeParse({ ...regularMeeting, speakers: "Jordan Sample | Service | administrator" });
  assert.equal(parsed.success, false);
  if (parsed.success) return;
  assert.ok(parsed.error.issues.some((issue) => issue.path[0] === "speakers"));
});

test("unsupported meeting types are rejected instead of silently becoming regular meetings", () => {
  const parsed = meetingFormSchema.safeParse({ ...regularMeeting, meetingType: "private" });
  assert.equal(parsed.success, false);
});

test("stake and general dates do not require or invent a sacrament program", () => {
  const parsed = meetingFormSchema.safeParse({
    ...regularMeeting,
    meetingType: "stake",
    presiding: "",
    conducting: "",
    openingHymnNumber: "",
    openingHymnTitle: "",
    sacramentHymnNumber: "",
    sacramentHymnTitle: "",
    closingHymnNumber: "",
    closingHymnTitle: "",
    speakers: "",
  });
  assert.equal(parsed.success, true);
  if (!parsed.success) return;

  const result = toMeetingData(parsed.data);
  assert.deepEqual(result.openingHymn, { number: 0, title: "" });
  assert.deepEqual(result.speakers, []);
  assert.equal(result.presiding, "Not applicable to a ward sacrament program");
});
