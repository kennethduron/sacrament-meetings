"use client";

import { useActionState } from "react";
import { deleteMeeting } from "@/lib/actions";
import { initialDeleteActionState } from "@/lib/action-state";

export default function DeleteMeetingForm({ meetingId }: { meetingId: number }) {
  const [state, action, pending] = useActionState(deleteMeeting, initialDeleteActionState);
  return (
    <form action={action} className="inline-flex" onSubmit={(event) => {
      if (!window.confirm("Delete this fictional sample meeting? This cannot be undone.")) event.preventDefault();
    }}>
      <input name="id" type="hidden" value={meetingId} />
      <button aria-label={`Delete meeting ${meetingId}`} className="button button-danger" disabled={pending} type="submit">
        {pending ? "Deleting..." : "Delete"}
      </button>
      {state.message && <span aria-live="polite" className="text-sm text-red-800" role="status">{state.message}</span>}
    </form>
  );
}
