import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

type MeetingsSearchParams = Promise<{
  query?: string | string[];
  page?: string | string[];
}>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function meetingsUrl(query: string, page: number): string {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/meetings?${search}` : "/meetings";
}

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: MeetingsSearchParams;
}) {
  const params = await searchParams;
  const query = (firstValue(params.query) ?? "").trim().slice(0, 100);
  const rawPage = firstValue(params.page);
  const parsedPage = rawPage === undefined ? 1 : Number(rawPage);
  const hasValidPage =
    rawPage === undefined || (/^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(parsedPage));
  const currentPage = hasValidPage ? parsedPage : 1;
  const totalPages = await getMeetingsTotalPages(query);

  if (!hasValidPage || currentPage > totalPages) {
    redirect(meetingsUrl(query, currentPage > totalPages ? totalPages : 1));
  }

  const meetings = await getMeetings(query, currentPage);

  return (
    <>
      <header className="section-heading">
        <p className="eyebrow">The schedule archive</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-navy-950 sm:text-5xl">
          Meetings &amp; programs
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Search and browse saved Sunday examples. Select a meeting to read or print its program.
        </p>
      </header>

      <section aria-label="Meeting archive" className="mt-8 space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Manage the fictional sample archive:</p>
          <Link className="button button-primary" href="/meetings/new">Create a meeting</Link>
        </div>
        <Suspense fallback={<div aria-live="polite" className="status-panel">Loading search controls...</div>}>
          <MeetingSearch />
        </Suspense>

        <div className="demo-banner" role="note">
          <strong>Fictional sample data:</strong> all people, announcements, and program details are examples for this assignment.
        </div>

        {meetings.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
          </div>
        ) : (
          <div className="status-panel" role="status">
            {query ? `No meetings matched “${query}”. Try another search.` : "No meeting records are available yet."}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </>
  );
}
