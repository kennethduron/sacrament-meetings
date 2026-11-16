"use client";

import Link from "next/link";

export default function MeetingsError({ reset }: { reset: () => void }) {
  return (
    <div className="status-panel status-error" role="alert">
      <h1 className="font-display text-2xl font-semibold">The meeting archive is unavailable</h1>
      <p className="mt-2">Please try again. No database details are shown here.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="button button-secondary" onClick={reset} type="button">Try again</button>
        <Link className="button button-secondary" href="/meetings">Return to meetings</Link>
      </div>
    </div>
  );
}
