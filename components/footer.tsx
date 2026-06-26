import Link from "next/link";
import { Mail } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { contactEmail, navItems } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-slate-900/10 bg-white/55 py-10 dark:border-white/10 dark:bg-white/5">
      <div className="section-shell grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <LogoMark />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            Your Voice. Our Responsibility. Together for Every Student.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Quick Links</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gold">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Contact</p>
          <a href={`mailto:${contactEmail}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-gold dark:text-white">
            <Mail size={16} />
            {contactEmail}
          </a>
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Copyright © {new Date().getFullYear()} NDA x UD Coalition
          </p>
        </div>
      </div>
    </footer>
  );
}
