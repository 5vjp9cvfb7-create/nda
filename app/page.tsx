import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Lightbulb, Megaphone, UsersRound } from "lucide-react";
import { Hero } from "@/components/hero";
import { MotionSection } from "@/components/motion-section";
import { StatCounters } from "@/components/stat-counters";
import { Button, Card, EmptyState, SectionHeading } from "@/components/ui";
import { coreValues, defaultAgenda } from "@/lib/data";
import { getLatestNotices, getSiteContent, getStats } from "@/lib/server-data";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [content, stats, notices] = await Promise.all([getSiteContent(), getStats(), getLatestNotices()]);
  const agendaPreview = defaultAgenda.slice(0, 4);

  return (
    <>
      <Hero />

      <MotionSection id="about">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="About the Coalition" title="Student leadership built on action, trust and responsibility." body={content.about} />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {coreValues.map((value) => (
                <div key={value} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white/70 px-4 py-3 text-sm font-bold text-ink dark:border-white/10 dark:bg-white/7 dark:text-white">
                  <CheckCircle2 size={17} className="text-gold" />
                  {value}
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/20 shadow-glow">
            <Image src="/images/nda-campaign-poster.jpeg" alt="NDA campaign poster" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="pt-0">
        <StatCounters stats={stats} />
      </MotionSection>

      <MotionSection className="grid gap-8 lg:grid-cols-2">
        <Card>
          <Lightbulb className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">Vision</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{content.vision}</p>
        </Card>
        <Card>
          <UsersRound className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">Mission</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{content.mission}</p>
        </Card>
      </MotionSection>

      <MotionSection>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Agenda" title="Practical priorities for every student." body={content.promise} />
          <Button href="/agenda" variant="secondary">
            View Agenda
            <ArrowRight size={17} />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {agendaPreview.map((item) => (
            <Link key={item.id} href={`/agenda/${item.slug}`} className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:shadow-glow">
              <Megaphone size={23} className="text-gold" />
              <h3 className="mt-4 text-lg font-black text-ink dark:text-white">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
            </Link>
          ))}
        </div>
      </MotionSection>

      <MotionSection>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Latest Notices" title="Official updates from the coalition." />
          <Button href="/notices" variant="secondary">
            Notice Portal
            <ArrowRight size={17} />
          </Button>
        </div>
        {!notices.length && <EmptyState title="No notices have been published yet." body="The latest three notices will appear here automatically once the admin team publishes them." />}
        <div className="grid gap-4 md:grid-cols-3">
          {notices.map((notice) => (
            <Card key={notice.id}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">{notice.category}</p>
              <h3 className="mt-3 text-xl font-black text-ink dark:text-white">{notice.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{formatDate(notice.createdAt)}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{notice.body}</p>
            </Card>
          ))}
        </div>
      </MotionSection>
    </>
  );
}
