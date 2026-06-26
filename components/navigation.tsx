"use client";

import { Search, Menu, Moon, Sun, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui";
import { defaultAgenda, defaultContent, defaultLeaders, navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return [
      ...defaultAgenda.map((item) => ({ title: item.title, href: `/agenda/${item.slug}`, type: "Agenda" })),
      ...defaultLeaders.map((item) => ({ title: item.name, href: "/leadership", type: "Leadership" })),
      { title: defaultContent.vision, href: "/about", type: "About" },
      { title: defaultContent.mission, href: "/about", type: "About" }
    ]
      .filter((item) => item.title.toLowerCase().includes(normalized) || item.type.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  function goToResult(href: string) {
    setSearchOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/78 backdrop-blur-2xl dark:border-white/10 dark:bg-ink/78">
      <nav className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="NDA x UD Home">
          <LogoMark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-ink/5 hover:text-ink dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
                pathname === item.href && "bg-gold/16 text-ink dark:text-gold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/70 text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/8 dark:text-white"
            title="Search"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/70 text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/8 dark:text-white"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Button href="/admin" variant="secondary" className="hidden h-10 px-3 lg:inline-flex" title="Admin dashboard">
            <ShieldCheck size={16} />
            Admin
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/70 text-ink lg:hidden dark:border-white/10 dark:bg-white/8 dark:text-white"
            aria-label="Open menu"
            title="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="section-shell pb-5 lg:hidden">
          <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-glow dark:border-white/10 dark:bg-ink-soft">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-bold text-slate-700 dark:text-slate-200",
                  pathname === item.href && "bg-gold/16 text-ink dark:text-gold"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg bg-ink px-3 py-3 text-sm font-bold text-white">
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-ink/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto mt-24 max-w-2xl rounded-lg border border-white/20 bg-white p-4 shadow-glow dark:bg-ink-soft">
            <div className="flex items-center gap-3">
              <Search className="text-gold" size={22} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search agenda, leadership, notices and about"
                className="focus-ring min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-ink placeholder:text-slate-400 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-ink dark:bg-white/10 dark:text-white"
                aria-label="Close search"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {query.trim() && !results.length && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">No matching results found.</p>}
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.title}`}
                  type="button"
                  onClick={() => goToResult(result.href)}
                  className="focus-ring rounded-lg border border-slate-200 p-4 text-left transition hover:border-gold hover:bg-gold/10 dark:border-white/10"
                >
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-gold">{result.type}</span>
                  <span className="mt-1 block line-clamp-2 text-sm font-bold text-ink dark:text-white">{result.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
