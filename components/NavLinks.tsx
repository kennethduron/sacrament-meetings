"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Overview" },
  { href: "/meetings", label: "Meeting archive" },
  { href: "/meetings/current", label: "This Sunday" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
      {navigationItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/meetings"
              ? pathname === "/meetings" ||
                (pathname.startsWith("/meetings/") && pathname !== "/meetings/current")
              : pathname === item.href;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`nav-link ${isActive ? "nav-link-active" : ""}`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
