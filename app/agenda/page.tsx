import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { MotionSection } from "@/components/motion-section";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/ui";
import { getAgenda, getSiteContent } from "@/lib/server-data";

export const metadata = {
  title: "Agenda"
};

export default async function AgendaPage() {
  const [agenda, content] = await Promise.all([getAgenda(), getSiteContent()]);

  return (
    <>
      <PageHero eyebrow="Agenda" title="A practical promise for student welfare." body={content.promise} />
      <MotionSection>
        <SectionHeading eyebrow="Priorities" title="Every agenda item can be expanded, edited and improved from the admin dashboard." />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agenda.map((item) => (
            <Link key={item.id} href={`/agenda/${item.slug}`} className="glass group rounded-lg p-6 transition hover:-translate-y-1 hover:shadow-glow">
              <BadgeCheck className="text-gold" size={26} />
              <h2 className="mt-4 text-xl font-black text-ink dark:text-white">{item.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-civic group-hover:text-gold dark:text-gold">
                Read details
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </MotionSection>
    </>
  );
}
