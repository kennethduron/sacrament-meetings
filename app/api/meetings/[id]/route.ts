import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

interface MeetingRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: MeetingRouteContext) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(meetingId)) {
    return NextResponse.json(
      { message: "Meeting id must be a positive integer." },
      { status: 400 },
    );
  }

  try {
    const meeting = await getMeetingById(meetingId);
    if (!meeting) {
      return NextResponse.json({ message: "Meeting not found." }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error(
      "GET /api/meetings/[id] failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return NextResponse.json(
      { message: "Unable to retrieve the meeting." },
      { status: 500 },
    );
  }
}
