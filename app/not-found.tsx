import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell py-20">
      <section className="status-panel">
        <p className="eyebrow">404 · Not found</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-navy-950">We could not find that page</h1>
        <p className="mt-3">The requested page or meeting is not available.</p>
        <Link className="button button-secondary mt-6" href="/meetings">Browse meetings</Link>
      </section>
    </main>
  );
}
