import { NextRequest, NextResponse } from "next/server";
import { getMeetings } from "@/lib/meetings-db";
import { isValidIsoDate } from "@/lib/date-utils";

export function GET(request: NextRequest) {
  const hasDateFilter = request.nextUrl.searchParams.has("date");
  const date = request.nextUrl.searchParams.get("date");

  if (hasDateFilter && (!date || !isValidIsoDate(date))) {
    return NextResponse.json(
      { message: "date must be a valid calendar date in YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  return NextResponse.json(getMeetings(date));
}
