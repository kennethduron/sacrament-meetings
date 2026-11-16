"use client";

import Link from "next/link";

export default function MeetingsAdminError({ reset }: { reset: () => void }) {
  return (
    <section className="status-panel status-error" role="alert">
      <h1 className="font-display text-2xl font-semibold">Meeting administration is unavailable</h1>
      <p className="mt-2">Your changes may not have been saved. Please try again or return to the meeting archive.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="button button-secondary" onClick={reset} type="button">Try again</button>
        <Link className="button button-secondary" href="/meetings">Return to meetings</Link>
      </div>
    </section>
  );
}
