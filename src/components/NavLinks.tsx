"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, Headphones, Sparkles, BookOpenText, BookText, Upload } from "lucide-react";

const LINKS = [
  { href: "/", label: "Übersicht", Icon: LayoutDashboard, exact: true },
  { href: "/lektionen", label: "Lektionen", Icon: GraduationCap },
  { href: "/lesen", label: "Lesen", Icon: BookOpenText },
  { href: "/diktat", label: "Üben", Icon: Headphones },
  { href: "/uebung", label: "Quiz", Icon: Sparkles },
  { href: "/lexikon", label: "Lexikon", Icon: BookText },
  { href: "/import", label: "Import", Icon: Upload },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-0.5">
      {LINKS.map(({ href, label, Icon, exact }) => {
        const aktiv = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              aktiv
                ? "bg-taeguk-blue/10 text-taeguk-blue"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Icon size={16} strokeWidth={2} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
