import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer no-print">
      <div className="page-shell flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          A sample planning tool for Sunday worship.
        </p>
        <Link className="text-sm font-semibold text-navy-700 hover:text-navy-900" href="/meetings">
          Browse the meeting archive
        </Link>
      </div>
    </footer>
  );
}
