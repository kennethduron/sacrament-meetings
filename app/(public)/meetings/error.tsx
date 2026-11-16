"use client";

export default function MeetingsError({ reset }: { reset: () => void }) {
  return (
    <div className="status-panel status-error" role="alert">
      <h1 className="font-display text-2xl font-semibold">The meeting archive is unavailable</h1>
      <p className="mt-2">Please try again. No database details are shown here.</p>
      <button className="button button-secondary mt-5" onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
