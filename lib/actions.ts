"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addMeeting, deleteMeeting as removeMeeting, updateMeeting as saveMeeting } from "./meetings-db";
import { getMeetingFormErrors, meetingFormSchema, readMeetingForm, toMeetingData } from "./meeting-form";
import type { DeleteActionState, MeetingActionState } from "./action-state";

export async function createMeeting(
  previousState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  const values = readMeetingForm(formData);
  const parsed = meetingFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      message: "Please correct the fields listed below.",
      errors: getMeetingFormErrors(parsed.error),
      values,
      attempt: previousState.attempt + 1,
    };
  }

  let meetingId: number;
  try {
    const meeting = await addMeeting(toMeetingData(parsed.data));
    meetingId = meeting.id;
  } catch (error) {
    console.error("Meeting creation failed:", error instanceof Error ? error.name : "Unknown error");
    return {
      message: "The meeting could not be saved. The date may already be in use; no existing record was replaced.",
      errors: {},
      values,
      attempt: previousState.attempt + 1,
    };
  }

  revalidatePath("/");
  revalidatePath("/meetings");
  redirect(`/meetings/${meetingId}`);
}

export async function updateMeeting(
  id: number,
  previousState: MeetingActionState,
  formData: FormData,
): Promise<MeetingActionState> {
  const values = readMeetingForm(formData);
  if (!Number.isSafeInteger(id) || id < 1) {
    return { message: "That meeting could not be found.", errors: {}, values, attempt: previousState.attempt + 1 };
  }

  const parsed = meetingFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      message: "Please correct the fields listed below.",
      errors: getMeetingFormErrors(parsed.error),
      values,
      attempt: previousState.attempt + 1,
    };
  }

  let updated = false;
  try {
    updated = (await saveMeeting(id, toMeetingData(parsed.data))) !== null;
  } catch (error) {
    console.error("Meeting update failed:", error instanceof Error ? error.name : "Unknown error");
    return {
      message: "The meeting could not be updated. Check that its date is not already used by another meeting.",
      errors: {},
      values,
      attempt: previousState.attempt + 1,
    };
  }

  if (!updated) return { message: "That meeting could not be found.", errors: {}, values, attempt: previousState.attempt + 1 };
  revalidatePath("/");
  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect(`/meetings/${id}`);
}

export async function deleteMeeting(
  _previousState: DeleteActionState,
  formData: FormData,
): Promise<DeleteActionState> {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return { message: "A valid meeting ID is required." };

  let deleted = false;
  try {
    deleted = await removeMeeting(id);
  } catch (error) {
    console.error("Meeting deletion failed:", error instanceof Error ? error.name : "Unknown error");
    return { message: "The meeting could not be deleted. Please try again." };
  }

  if (!deleted) return { message: "That meeting no longer exists." };
  revalidatePath("/");
  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect("/meetings");
}
