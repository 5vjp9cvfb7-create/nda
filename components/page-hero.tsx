import { SectionHeading } from "@/components/ui";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export function PageHero({ eyebrow, title, body }: PageHeroProps) {
  return (
    <section className="border-b border-slate-900/10 bg-white/50 py-16 dark:border-white/10 dark:bg-white/5">
      <div className="section-shell">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
      </div>
    </section>
  );
}
