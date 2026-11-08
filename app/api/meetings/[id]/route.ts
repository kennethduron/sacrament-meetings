import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

interface MeetingRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: MeetingRouteContext) {
  const { id } = await context.params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId < 1) {
    return NextResponse.json(
      { message: "Meeting id must be a positive integer." },
      { status: 400 },
    );
  }

  const meeting = getMeetingById(meetingId);
  if (!meeting) {
    return NextResponse.json({ message: "Meeting not found." }, { status: 404 });
  }

  return NextResponse.json(meeting);
}
