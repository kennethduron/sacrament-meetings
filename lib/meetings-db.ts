import { neon } from "@neondatabase/serverless";
import type { Hymn, MeetingType, SacramentMeeting, SpeakerItem, WardBusinessItem } from "@/lib/types";

const ITEMS_PER_PAGE = 5;
const MAX_SEARCH_LENGTH = 100;

type MeetingRow = {
  id: number | string;
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[] | null;
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[] | null;
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[] | null;
  closingHymn: Hymn;
  closingPrayer: string;
};

function getSqlClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

function normalizeSearch(query: string): string {
  return query.trim().slice(0, MAX_SEARCH_LENGTH);
}

function toMeeting(row: MeetingRow): SacramentMeeting {
  return {
    ...row,
    id: Number(row.id),
    announcements: row.announcements ?? [],
    wardBusiness: row.wardBusiness ?? [],
    speakers: row.speakers ?? [],
  };
}

function searchPattern(query: string): string {
  return `%${normalizeSearch(query)}%`;
}

export async function getMeetings(
  query = "",
  currentPage = 1,
  date?: string | null,
): Promise<SacramentMeeting[]> {
  const sql = getSqlClient();
  const pattern = searchPattern(query);
  const hasSearch = normalizeSearch(query).length > 0;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = date
    ? await sql`
        SELECT
          id,
          to_char(date, 'YYYY-MM-DD') AS date,
          meeting_type AS "meetingType",
          presiding,
          conducting,
          announcements,
          opening_hymn AS "openingHymn",
          opening_prayer AS "openingPrayer",
          ward_business AS "wardBusiness",
          stake_business AS "stakeBusiness",
          sacrament_hymn AS "sacramentHymn",
          speakers,
          closing_hymn AS "closingHymn",
          closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE date = ${date}::date
          AND (
            NOT ${hasSearch}
            OR presiding ILIKE ${pattern}
            OR conducting ILIKE ${pattern}
            OR meeting_type ILIKE ${pattern}
            OR speakers::text ILIKE ${pattern}
          )
        ORDER BY date DESC, id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `
    : await sql`
        SELECT
          id,
          to_char(date, 'YYYY-MM-DD') AS date,
          meeting_type AS "meetingType",
          presiding,
          conducting,
          announcements,
          opening_hymn AS "openingHymn",
          opening_prayer AS "openingPrayer",
          ward_business AS "wardBusiness",
          stake_business AS "stakeBusiness",
          sacrament_hymn AS "sacramentHymn",
          speakers,
          closing_hymn AS "closingHymn",
          closing_prayer AS "closingPrayer"
        FROM meetings
        WHERE NOT ${hasSearch}
          OR presiding ILIKE ${pattern}
          OR conducting ILIKE ${pattern}
          OR meeting_type ILIKE ${pattern}
          OR speakers::text ILIKE ${pattern}
        ORDER BY date DESC, id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

  return (rows as unknown as MeetingRow[]).map(toMeeting);
}

export async function getMeetingsTotalPages(query = ""): Promise<number> {
  const sql = getSqlClient();
  const pattern = searchPattern(query);
  const hasSearch = normalizeSearch(query).length > 0;
  const rows = (await sql`
    SELECT COUNT(*) AS count
    FROM meetings
    WHERE NOT ${hasSearch}
      OR presiding ILIKE ${pattern}
      OR conducting ILIKE ${pattern}
      OR meeting_type ILIKE ${pattern}
      OR speakers::text ILIKE ${pattern}
  `) as unknown as { count: number | string }[];

  return Math.max(1, Math.ceil(Number(rows[0]?.count ?? 0) / ITEMS_PER_PAGE));
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
  const sql = getSqlClient();
  const rows = (await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType",
      presiding,
      conducting,
      announcements,
      opening_hymn AS "openingHymn",
      opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness",
      stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn",
      speakers,
      closing_hymn AS "closingHymn",
      closing_prayer AS "closingPrayer"
    FROM meetings
    WHERE id = ${id}
    LIMIT 1
  `) as unknown as MeetingRow[];

  return rows[0] ? toMeeting(rows[0]) : null;
}

export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  const sql = getSqlClient();
  const rows = (await sql`
    INSERT INTO meetings (
      date, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    ) VALUES (
      ${data.date}::date,
      ${data.meetingType},
      ${data.presiding},
      ${data.conducting},
      ${data.announcements ?? []},
      ${JSON.stringify(data.openingHymn)}::jsonb,
      ${data.openingPrayer},
      ${JSON.stringify(data.wardBusiness)}::jsonb,
      ${data.stakeBusiness},
      ${JSON.stringify(data.sacramentHymn)}::jsonb,
      ${JSON.stringify(data.speakers)}::jsonb,
      ${JSON.stringify(data.closingHymn)}::jsonb,
      ${data.closingPrayer}
    )
    RETURNING
      id, to_char(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType", presiding, conducting, announcements,
      opening_hymn AS "openingHymn", opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness", stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn", speakers,
      closing_hymn AS "closingHymn", closing_prayer AS "closingPrayer"
  `) as unknown as MeetingRow[];

  if (!rows[0]) throw new Error("The meeting could not be created.");
  return toMeeting(rows[0]);
}

export async function updateMeeting(
  id: number,
  updates: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;

  const sql = getSqlClient();
  const rows = (await sql`
    UPDATE meetings SET
      date = ${updates.date}::date,
      meeting_type = ${updates.meetingType},
      presiding = ${updates.presiding},
      conducting = ${updates.conducting},
      announcements = ${updates.announcements ?? []},
      opening_hymn = ${JSON.stringify(updates.openingHymn)}::jsonb,
      opening_prayer = ${updates.openingPrayer},
      ward_business = ${JSON.stringify(updates.wardBusiness)}::jsonb,
      stake_business = ${updates.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(updates.sacramentHymn)}::jsonb,
      speakers = ${JSON.stringify(updates.speakers)}::jsonb,
      closing_hymn = ${JSON.stringify(updates.closingHymn)}::jsonb,
      closing_prayer = ${updates.closingPrayer}
    WHERE id = ${id}
    RETURNING
      id, to_char(date, 'YYYY-MM-DD') AS date,
      meeting_type AS "meetingType", presiding, conducting, announcements,
      opening_hymn AS "openingHymn", opening_prayer AS "openingPrayer",
      ward_business AS "wardBusiness", stake_business AS "stakeBusiness",
      sacrament_hymn AS "sacramentHymn", speakers,
      closing_hymn AS "closingHymn", closing_prayer AS "closingPrayer"
  `) as unknown as MeetingRow[];

  return rows[0] ? toMeeting(rows[0]) : null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
  if (!Number.isSafeInteger(id) || id < 1) return false;

  const sql = getSqlClient();
  const rows = (await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `) as unknown as { id: number | string }[];

  return rows.length > 0;
}
