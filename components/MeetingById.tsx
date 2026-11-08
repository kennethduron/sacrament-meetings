"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import type { SacramentMeeting } from "@/lib/types";

type DetailState = "loading" | "success" | "not-found" | "error";

export default function MeetingById() {
  const params = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<SacramentMeeting | null>(null);
  const [state, setState] = useState<DetailState>("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeeting() {
      try {
        const response = await fetch(`/api/meetings/${encodeURIComponent(params.id)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (response.status === 404) {
          setState("not-found");
          return;
        }
        if (!response.ok) throw new Error("The meeting could not be loaded.");
        const data: SacramentMeeting = await response.json();
        setMeeting(data);
        setState("success");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }

    void loadMeeting();
    return () => controller.abort();
  }, [params.id]);

  if (state === "loading") return <p aria-live="polite" className="status-panel">Loading meeting details…</p>;
  if (state === "not-found") return <div className="status-panel"><h1 className="font-display text-2xl font-semibold">Meeting not found</h1><p className="mt-2">That meeting ID is not in the sample archive.</p><Link className="inline-link mt-4" href="/meetings">Return to meetings</Link></div>;
  if (state === "error" || !meeting) return <div className="status-panel status-error" role="alert">Meeting details could not be loaded. Please try again.</div>;

  return <MeetingDetail meeting={meeting} />;
}
