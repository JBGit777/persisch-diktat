import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Taegeuk from "@/components/Taegeuk";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

export default async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Taegeuk size={26} />
            <span className="text-sm font-bold tracking-tight">
              <span lang="fa">فارسی</span>{" "}
              <span className="text-taeguk-blue">Diktat</span>
            </span>
          </Link>
          <span className="mx-1 hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user?.email && (
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 md:inline">{user.email}</span>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Abmelden"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
