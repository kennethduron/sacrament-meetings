import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="page-shell flex min-h-16 items-center justify-between gap-4">
          <p className="font-semibold text-navy-950">Meeting administration</p>
          <Link className="inline-link" href="/meetings">
            View public meetings
          </Link>
        </div>
      </header>
      <main className="page-shell py-10" id="main-content">
        {children}
      </main>
    </div>
  );
}
