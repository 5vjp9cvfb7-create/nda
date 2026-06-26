"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";

const initialState = {
  email: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      setForm(initialState);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass grid gap-4 rounded-lg p-6">
      <label className="grid gap-2">
        <span className="text-sm font-bold text-ink dark:text-white">Email Address</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-ink dark:text-white">Subject</span>
        <input
          required
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          className="focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-ink dark:text-white">Message</span>
        <textarea
          required
          rows={7}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-3 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white"
        />
      </label>
      <Button type="submit" disabled={status === "loading"}>
        <Send size={17} />
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
      {status === "success" && (
        <p className="rounded-lg bg-emerald-500/12 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
          Thank you. Your query has been received. We will review it and work towards the best possible solution.
        </p>
      )}
      {status === "error" && <p className="rounded-lg bg-red-500/12 p-4 text-sm font-semibold text-red-700 dark:text-red-200">Something went wrong. Please try again.</p>}
    </form>
  );
}
