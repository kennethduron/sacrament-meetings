"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { MeetingActionState } from "@/lib/action-state";
import { initialMeetingActionState } from "@/lib/action-state";
import type { MeetingFormValues } from "@/lib/meeting-form";
import type { SacramentMeeting } from "@/lib/types";
import { SubmitButton } from "@/components/SubmitButton";

type MeetingFormAction = (
  previousState: MeetingActionState,
  formData: FormData,
) => Promise<MeetingActionState>;

function FieldError({ id, errors }: { id: string; errors: string[] | undefined }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-800" id={`${id}-error`}>{errors.join(" ")}</p>;
}

interface MeetingFormProps {
  action: MeetingFormAction;
  meeting?: SacramentMeeting;
}

export default function MeetingForm({ action, meeting }: MeetingFormProps) {
  const [state, formAction] = useActionState(action, initialMeetingActionState);
  const values: MeetingFormValues | undefined = state.values;
  const initial = meeting;
  const value = (key: keyof MeetingFormValues, fallback = "") => values?.[key] ?? fallback;
  const errors = state.errors;

  return (
    <form action={formAction} className="space-y-8">
      {state.message && (
        <div aria-live="polite" className="status-panel status-error" role="alert">{state.message}</div>
      )}
      {Object.keys(errors).length > 0 && (
        <div aria-live="polite" className="status-panel status-error" role="alert">
          <p className="font-semibold">Review the highlighted fields.</p>
          <ul className="mt-2 list-inside list-disc">
            {Object.entries(errors).map(([field, messages]) => (
              <li key={field}><a className="underline" href={`#${field}`}>{field}</a>: {messages[0]}</li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="grid gap-5 md:grid-cols-2" key={state.attempt}>
        <legend className="sr-only">Meeting details</legend>
        <div>
          <label className="block text-sm font-semibold text-navy-950" htmlFor="date">Meeting date</label>
          <input aria-describedby={errors.date ? "date-error" : undefined} aria-invalid={Boolean(errors.date)} className="form-control mt-2" defaultValue={value("date", initial?.date ?? "")} id="date" name="date" required type="date" />
          <FieldError errors={errors.date} id="date" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-950" htmlFor="meetingType">Meeting type</label>
          <select aria-describedby={errors.meetingType ? "meetingType-error" : undefined} aria-invalid={Boolean(errors.meetingType)} className="form-control mt-2" defaultValue={value("meetingType", initial?.meetingType ?? "regular")} id="meetingType" name="meetingType">
            <option value="regular">Regular</option><option value="testimony">Testimony</option><option value="stake">Stake Sunday</option><option value="general">General conference</option><option value="special">Special</option>
          </select>
          <FieldError errors={errors.meetingType} id="meetingType" />
        </div>

        {(["presiding", "conducting"] as const).map((name) => (
          <div key={name}>
            <label className="block text-sm font-semibold text-navy-950" htmlFor={name}>{name === "presiding" ? "Presiding person" : "Conducting person"}</label>
            <input aria-describedby={errors[name] ? `${name}-error` : undefined} aria-invalid={Boolean(errors[name])} className="form-control mt-2" defaultValue={value(name, initial?.[name] ?? "")} id={name} maxLength={255} name={name} />
            <FieldError errors={errors[name]} id={name} />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-navy-950" htmlFor="announcements">Announcements <span className="font-normal text-slate-600">(one per line)</span></label>
          <textarea aria-describedby={errors.announcements ? "announcements-error" : undefined} aria-invalid={Boolean(errors.announcements)} className="form-control mt-2 min-h-24" defaultValue={value("announcements", initial?.announcements?.join("\n") ?? "")} id="announcements" maxLength={4000} name="announcements" />
          <FieldError errors={errors.announcements} id="announcements" />
        </div>

        <HymnFields prefix="openingHymn" title="Opening hymn" errors={errors} numberValue={value("openingHymnNumber", initial?.openingHymn.number ? String(initial.openingHymn.number) : "")} titleValue={value("openingHymnTitle", initial?.openingHymn.title ?? "")} />
        <div>
          <label className="block text-sm font-semibold text-navy-950" htmlFor="openingPrayer">Opening prayer</label>
          <input aria-describedby={errors.openingPrayer ? "openingPrayer-error" : undefined} aria-invalid={Boolean(errors.openingPrayer)} className="form-control mt-2" defaultValue={value("openingPrayer", initial?.openingPrayer ?? "")} id="openingPrayer" maxLength={255} name="openingPrayer" />
          <FieldError errors={errors.openingPrayer} id="openingPrayer" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-navy-950" htmlFor="wardBusiness">Ward business <span className="font-normal text-slate-600">(one item per line)</span></label>
          <textarea aria-describedby={errors.wardBusiness ? "wardBusiness-error" : undefined} aria-invalid={Boolean(errors.wardBusiness)} className="form-control mt-2 min-h-24" defaultValue={value("wardBusiness", initial?.wardBusiness.map((item) => item.description).join("\n") ?? "")} id="wardBusiness" maxLength={4000} name="wardBusiness" />
          <FieldError errors={errors.wardBusiness} id="wardBusiness" />
        </div>
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 text-sm text-navy-950" htmlFor="stakeBusiness">
            <input className="mt-1 size-4 accent-slate-800" defaultChecked={value("stakeBusiness", initial?.stakeBusiness ? "on" : "") === "on"} id="stakeBusiness" name="stakeBusiness" type="checkbox" />
            Stake business is scheduled
          </label>
        </div>
        <HymnFields prefix="sacramentHymn" title="Sacrament hymn" errors={errors} numberValue={value("sacramentHymnNumber", initial?.sacramentHymn.number ? String(initial.sacramentHymn.number) : "")} titleValue={value("sacramentHymnTitle", initial?.sacramentHymn.title ?? "")} />
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-navy-950" htmlFor="speakers">Speakers and music <span className="font-normal text-slate-600">(one per line: Name | topic | speaker or musical-number)</span></label>
          <textarea aria-describedby={errors.speakers ? "speakers-error speakers-help" : "speakers-help"} aria-invalid={Boolean(errors.speakers)} className="form-control mt-2 min-h-28" defaultValue={value("speakers", initial?.speakers.map((item) => `${item.name} | ${item.topic} | ${item.type}`).join("\n") ?? "")} id="speakers" maxLength={4000} name="speakers" />
          <p className="mt-1 text-xs text-slate-600" id="speakers-help">Example: Jordan Sample | Finding peace | speaker</p>
          <FieldError errors={errors.speakers} id="speakers" />
        </div>
        <HymnFields prefix="closingHymn" title="Closing hymn" errors={errors} numberValue={value("closingHymnNumber", initial?.closingHymn.number ? String(initial.closingHymn.number) : "")} titleValue={value("closingHymnTitle", initial?.closingHymn.title ?? "")} />
        <div>
          <label className="block text-sm font-semibold text-navy-950" htmlFor="closingPrayer">Closing prayer</label>
          <input aria-describedby={errors.closingPrayer ? "closingPrayer-error" : undefined} aria-invalid={Boolean(errors.closingPrayer)} className="form-control mt-2" defaultValue={value("closingPrayer", initial?.closingPrayer ?? "")} id="closingPrayer" maxLength={255} name="closingPrayer" />
          <FieldError errors={errors.closingPrayer} id="closingPrayer" />
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton label={initial ? "Save meeting changes" : "Create meeting"} pendingLabel={initial ? "Saving meeting..." : "Creating meeting..."} />
        <Link className="button button-secondary" href={initial ? `/meetings/${initial.id}` : "/meetings"}>Cancel</Link>
      </div>
    </form>
  );
}

function HymnFields({
  prefix, title, errors, numberValue, titleValue,
}: {
  prefix: "openingHymn" | "sacramentHymn" | "closingHymn";
  title: string;
  errors: Record<string, string[]>;
  numberValue: string;
  titleValue: string;
}) {
  const numberName = `${prefix}Number`;
  const titleName = `${prefix}Title`;
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(7rem,0.35fr)_1fr] sm:items-start">
      <div>
        <label className="block text-sm font-semibold text-navy-950" htmlFor={numberName}>{title} number</label>
        <input aria-describedby={errors[numberName] ? `${numberName}-error` : undefined} aria-invalid={Boolean(errors[numberName])} className="form-control mt-2" defaultValue={numberValue} id={numberName} inputMode="numeric" name={numberName} />
        <FieldError errors={errors[numberName]} id={numberName} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-950" htmlFor={titleName}>{title} title</label>
        <input aria-describedby={errors[titleName] ? `${titleName}-error` : undefined} aria-invalid={Boolean(errors[titleName])} className="form-control mt-2" defaultValue={titleValue} id={titleName} maxLength={255} name={titleName} />
        <FieldError errors={errors[titleName]} id={titleName} />
      </div>
    </div>
  );
}
