"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pageHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <nav aria-label="Meeting pages" className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">
      {currentPage > 1 ? (
        <Link className="button button-secondary" href={pageHref(currentPage - 1)}>
          Previous page
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      <p aria-live="polite" className="text-sm font-medium text-slate-700">
        Page {currentPage} of {totalPages}
      </p>
      {currentPage < totalPages ? (
        <Link className="button button-secondary" href={pageHref(currentPage + 1)}>
          Next page
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
