import type { MeetingFormValues } from "./meeting-form";

export interface MeetingActionState {
  message: string;
  errors: Record<string, string[]>;
  values?: MeetingFormValues;
  attempt: number;
}

export const initialMeetingActionState: MeetingActionState = {
  message: "",
  errors: {},
  attempt: 0,
};

export interface DeleteActionState {
  message: string;
}

export const initialDeleteActionState: DeleteActionState = { message: "" };
