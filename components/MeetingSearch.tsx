"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function MeetingSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("query") ?? "";

  const updateSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const query = term.trim();

    params.set("page", "1");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <label className="block max-w-xl">
      <span className="mb-2 block text-sm font-semibold text-navy-900">
        Search meetings
      </span>
      <input
        aria-label="Search by speaker, presiding leader, conducting leader, or meeting type"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus-visible:border-navy-700 focus-visible:ring-2 focus-visible:ring-navy-700"
        defaultValue={queryFromUrl}
        key={queryFromUrl}
        maxLength={100}
        onChange={(event) => {
          updateSearch(event.target.value);
        }}
        placeholder="Try a name or meeting type"
        type="search"
      />
      <span className="mt-1 block text-xs text-slate-600">
        Search speakers, leaders, and meeting types.
      </span>
    </label>
  );
}
