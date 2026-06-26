import Image from "next/image";

type LogoMarkProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: LogoMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-gold/40 bg-white shadow-gold">
        <Image src="/images/nda-emblem.jpeg" alt="NDA logo" fill sizes="44px" className="object-cover" priority />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-black uppercase tracking-[0.22em] text-gold">NDA x UD</div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">Coalition</div>
        </div>
      )}
    </div>
  );
}
