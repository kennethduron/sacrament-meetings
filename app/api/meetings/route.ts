import { NextRequest, NextResponse } from "next/server";
import { getMeetings } from "@/lib/meetings-db";
import { isValidIsoDate } from "@/lib/date-utils";

export async function GET(request: NextRequest) {
  const hasDateFilter = request.nextUrl.searchParams.has("date");
  const date = request.nextUrl.searchParams.get("date");
  const query = request.nextUrl.searchParams.get("query") ?? "";
  const rawPage = request.nextUrl.searchParams.get("page") ?? "1";
  const page = Number(rawPage);

  if (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(page)) {
    return NextResponse.json(
      { message: "page must be a positive integer." },
      { status: 400 },
    );
  }

  if (hasDateFilter && (!date || !isValidIsoDate(date))) {
    return NextResponse.json(
      { message: "date must be a valid calendar date in YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await getMeetings(query, page, date));
  } catch (error) {
    console.error(
      "GET /api/meetings failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return NextResponse.json(
      { message: "Unable to retrieve meetings." },
      { status: 500 },
    );
  }
}
