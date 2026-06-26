import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  title
}: ButtonProps) {
  const styles = cn(
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition",
    variant === "primary" && "bg-ink text-white shadow-glow hover:-translate-y-0.5 hover:bg-civic dark:bg-gold dark:text-ink",
    variant === "secondary" &&
      "border border-gold/55 bg-white/80 text-ink shadow-gold hover:-translate-y-0.5 dark:bg-white/10 dark:text-white",
    variant === "ghost" && "text-ink hover:bg-ink/5 dark:text-white dark:hover:bg-white/10",
    disabled && "pointer-events-none opacity-55",
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={styles} title={title}>
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-black leading-tight text-ink dark:text-white sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{body}</p>}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass rounded-lg p-6 transition hover:-translate-y-1 hover:shadow-glow", className)}>{children}</div>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/55 p-8 text-center dark:border-white/15 dark:bg-white/5">
      <p className="text-lg font-black text-ink dark:text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}
