"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MeetingCard from "@/components/MeetingCard";
import type { SacramentMeeting } from "@/lib/types";

type LoadState = "loading" | "success" | "empty" | "error";

export default function MeetingsList() {
  const [meetings, setMeetings] = useState<SacramentMeeting[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeetings() {
      try {
        const response = await fetch("/api/meetings", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("The meeting list could not be loaded.");
        const data: SacramentMeeting[] = await response.json();
        setMeetings(data);
        setState(data.length > 0 ? "success" : "empty");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }

    void loadMeetings();
    return () => controller.abort();
  }, []);

  if (state === "loading") return <p aria-live="polite" className="status-panel">Loading the meeting archive…</p>;
  if (state === "error") return <div className="status-panel status-error" role="alert">The archive could not be loaded. Please refresh the page and try again.</div>;
  if (state === "empty") return <div className="status-panel">No meeting records are available yet.</div>;

  return (
    <div className="space-y-8">
      <div className="demo-banner" role="note">
        <strong>Fictional sample data:</strong> all people, announcements, and program details are examples for this assignment.
        <Link className="ml-2 font-semibold underline underline-offset-4" href="/meetings/current">Go to this Sunday</Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
      </div>
    </div>
  );
}
