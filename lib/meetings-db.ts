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

// Mutation functions are intentionally deferred until Week 04 forms are built.
export async function addMeeting(
  data: Omit<SacramentMeeting, "id">,
): Promise<SacramentMeeting> {
  void data;
  throw new Error("addMeeting: database implementation is planned for Week 04.");
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>,
): Promise<SacramentMeeting | null> {
  void id;
  void updates;
  throw new Error("updateMeeting: database implementation is planned for Week 04.");
}

export async function deleteMeeting(id: number): Promise<boolean> {
  void id;
  throw new Error("deleteMeeting: database implementation is planned for Week 04.");
}
