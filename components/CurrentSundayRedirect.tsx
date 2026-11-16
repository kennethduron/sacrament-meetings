"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SacramentMeeting } from "@/lib/types";

type CurrentState = "loading" | "missing" | "error";

function getCurrentSundayDate(): string {
  const localDate = new Date();
  const sunday = new Date(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate() - localDate.getDay(),
  );
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, "0");
  const day = String(sunday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CurrentSundayRedirect() {
  const router = useRouter();
  const [state, setState] = useState<CurrentState>("loading");

  useEffect(() => {
    const controller = new AbortController();
    const sunday = getCurrentSundayDate();

    async function findThisSunday() {
      try {
        const response = await fetch(`/api/meetings?date=${sunday}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("The Sunday schedule could not be checked.");
        const meetings: SacramentMeeting[] = await response.json();
        if (meetings[0]) {
          router.replace(`/meetings/${meetings[0].id}`);
          return;
        }
        setState("missing");
      } catch {
        if (!controller.signal.aborted) setState("error");
      }
    }

    void findThisSunday();
    return () => controller.abort();
  }, [router]);

  if (state === "loading") return <p aria-live="polite" className="status-panel">Finding this Sunday’s schedule…</p>;
  if (state === "error") return <div className="status-panel status-error" role="alert">The current Sunday schedule could not be checked. Please try again later.</div>;

  return (
    <div className="status-panel">
      <p className="eyebrow">No matching sample record</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950">This Sunday is not in the example archive</h1>
      <p className="mt-2 text-slate-600">The sample data has no entry for the current Sunday. Browse the archive to view the available examples.</p>
      <Link className="button button-primary mt-6" href="/meetings">Browse meetings</Link>
    </div>
  );
}
