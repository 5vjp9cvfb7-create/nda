"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";

const initialState = {
  fullName: "",
  className: "",
  section: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  reason: "",
  skills: "",
  interests: ""
};

export function JoinForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const response = await fetch("/api/join", {
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

  const inputClass = "focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white";

  return (
    <form onSubmit={onSubmit} className="glass grid gap-4 rounded-lg p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Full Name</span>
          <input required value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Class</span>
          <input required value={form.className} onChange={(event) => updateField("className", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Section</span>
          <input required value={form.section} onChange={(event) => updateField("section", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Age</span>
          <input required type="number" min="5" value={form.age} onChange={(event) => updateField("age", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Gender</span>
          <select required value={form.gender} onChange={(event) => updateField("gender", event.target.value)} className={inputClass}>
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Phone Number</span>
          <input required type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Email Address</span>
          <input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Address</span>
          <input required value={form.address} onChange={(event) => updateField("address", event.target.value)} className={inputClass} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-bold">Reason for Joining</span>
        <textarea required rows={4} value={form.reason} onChange={(event) => updateField("reason", event.target.value)} className={`${inputClass} py-3`} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold">Skills</span>
          <input required value={form.skills} onChange={(event) => updateField("skills", event.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-bold">Interests</span>
          <input required value={form.interests} onChange={(event) => updateField("interests", event.target.value)} className={inputClass} />
        </label>
      </div>
      <Button type="submit" disabled={status === "loading"}>
        <UserPlus size={17} />
        {status === "loading" ? "Submitting..." : "Submit Application"}
      </Button>
      {status === "success" && <p className="rounded-lg bg-emerald-500/12 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-200">Your membership request has been submitted successfully.</p>}
      {status === "error" && <p className="rounded-lg bg-red-500/12 p-4 text-sm font-semibold text-red-700 dark:text-red-200">Something went wrong. Please try again.</p>}
    </form>
  );
}
