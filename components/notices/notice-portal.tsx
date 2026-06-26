"use client";

import { FileText, Pin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui";
import type { Notice } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function NoticePortal({ notices }: { notices: Notice[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return notices
      .filter((notice) => category === "All" || notice.category === category)
      .filter((notice) => {
        const text = `${notice.title} ${notice.body} ${notice.category}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [category, notices, query]);

  return (
    <div className="grid gap-6">
      <div className="glass grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-white/8">
          <Search size={18} className="text-gold" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notices"
            className="focus-ring min-h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink dark:text-white"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="focus-ring min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-ink dark:border-white/10 dark:bg-ink dark:text-white"
        >
          {["All", "General", "Academic", "Event", "Urgent"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {!notices.length && (
        <EmptyState title="No notices available." body="Important updates will appear here after they are published from the admin dashboard." />
      )}

      {notices.length > 0 && !filtered.length && (
        <EmptyState title="No matching notices." body="Try a different keyword or category filter." />
      )}

      <div className="grid gap-4">
        {filtered.map((notice) => (
          <article key={notice.id} className="glass rounded-lg p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-gold/18 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-gold">
                {notice.category}
              </span>
              {notice.pinned && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-ink px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white dark:bg-gold dark:text-ink">
                  <Pin size={13} />
                  Pinned
                </span>
              )}
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{formatDate(notice.createdAt)}</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">{notice.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{notice.body}</p>
            {(notice.pdfUrl || notice.imageUrl) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {notice.pdfUrl && (
                  <a href={notice.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:border-gold dark:border-white/10">
                    <FileText size={16} />
                    View PDF
                  </a>
                )}
                {notice.imageUrl && (
                  <a href={notice.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold hover:border-gold dark:border-white/10">
                    View Image
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
