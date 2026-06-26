"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";

export function AdminLogin() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase is not configured.");
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/admin";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
        <div className="glass max-w-lg rounded-lg p-6 text-center">
          <h1 className="text-3xl font-black text-ink dark:text-white">Admin Demo Mode</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Firebase credentials are not configured yet, so the dashboard is available in local demo mode.
          </p>
          <Button href="/admin" className="mt-6">
            Open Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={onSubmit} className="glass w-full max-w-md rounded-lg p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Protected Login</p>
        <h1 className="mt-3 text-3xl font-black text-ink dark:text-white">Admin Dashboard</h1>
        {params.get("denied") && <p className="mt-4 rounded-lg bg-red-500/12 p-3 text-sm font-bold text-red-700 dark:text-red-200">This email is not authorized.</p>}
        <label className="mt-6 grid gap-2">
          <span className="text-sm font-bold">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white"
          />
        </label>
        <label className="mt-4 grid gap-2">
          <span className="text-sm font-bold">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white"
          />
        </label>
        <Button type="submit" disabled={loading} className="mt-6 w-full">
          <LogIn size={17} />
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        {error && <p className="mt-4 rounded-lg bg-red-500/12 p-3 text-sm font-bold text-red-700 dark:text-red-200">{error}</p>}
        <Link href="/" className="mt-5 block text-center text-sm font-bold text-civic hover:text-gold dark:text-gold">
          Back to website
        </Link>
      </form>
    </div>
  );
}
