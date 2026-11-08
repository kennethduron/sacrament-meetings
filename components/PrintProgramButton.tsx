"use client";

export default function PrintProgramButton() {
  return (
    <button className="button button-secondary no-print" onClick={() => window.print()} type="button">
      <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
        <path d="M5.5 6V2.5h9V6M5 14H3.5A1.5 1.5 0 0 1 2 12.5v-4A1.5 1.5 0 0 1 3.5 7h13A1.5 1.5 0 0 1 18 8.5v4a1.5 1.5 0 0 1-1.5 1.5H15M5.5 11.5h9v6h-9z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle cx="15" cy="9.5" r=".75" fill="currentColor" />
      </svg>
      Print Program
    </button>
  );
}
