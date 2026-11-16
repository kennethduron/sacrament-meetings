"use client";

import Link from "next/link";
import { Suspense, useSyncExternalStore } from "react";
import NavLinks from "@/components/NavLinks";

function subscribeToDateChanges(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, 60 * 60 * 1000);
  return () => window.clearInterval(timer);
}

function getCurrentDateLabel(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Tegucigalpa",
  }).format(new Date());
}

function getServerDateLabel(): string {
  return "Your Sunday schedule";
}

export default function Header() {
  const today = useSyncExternalStore(
    subscribeToDateChanges,
    getCurrentDateLabel,
    getServerDateLabel,
  );

  return (
    <header className="site-header no-print">
      <div className="page-shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
        <Link aria-label="Example Ward home" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            <svg fill="none" viewBox="0 0 28 28">
              <path d="M4 12.5 14 5l10 7.5v10H4v-10Z" stroke="currentColor" strokeWidth="1.7" />
              <path d="M10 22v-6a4 4 0 0 1 8 0v6M13.5 2h1v5h-1z" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </span>
          <span>
            <span className="brand-name">Sacrament Planner</span>
            <span className="brand-subtitle">Example Ward · sample data</span>
          </span>
        </Link>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <p className="text-xs font-medium text-slate-500">{today}</p>
          <Suspense fallback={<nav aria-label="Main navigation" className="h-9" />}>
            <NavLinks />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
