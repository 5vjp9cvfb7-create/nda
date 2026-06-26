"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const activeAuth = auth;

    return onAuthStateChanged(activeAuth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/admin/login");
        return;
      }

      if (adminEmails.length && !adminEmails.includes((currentUser.email ?? "").toLowerCase())) {
        await signOut(activeAuth);
        router.replace("/admin/login?denied=1");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });
  }, [adminEmails, router]);

  if (!isFirebaseConfigured) {
    return (
      <>
        <div className="border-b border-amber-400/30 bg-amber-300/18 px-4 py-3 text-center text-sm font-bold text-amber-900 dark:text-amber-100">
          Demo admin mode is active. Add Firebase environment variables to enable protected login, Firestore and Storage.
        </div>
        {children}
      </>
    );
  }

  if (loading || !user) {
    return (
      <div className="section-shell flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}
