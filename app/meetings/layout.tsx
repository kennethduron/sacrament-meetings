import type { ReactNode } from "react";

export default function MeetingsLayout({ children }: { children: ReactNode }) {
  return <section className="page-shell flex-1 py-10 sm:py-14">{children}</section>;
}
