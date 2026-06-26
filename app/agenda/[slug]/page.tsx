import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { MotionSection } from "@/components/motion-section";
import { Button } from "@/components/ui";
import { getAgenda } from "@/lib/server-data";

type AgendaDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const agenda = await getAgenda();
  return agenda.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: AgendaDetailProps) {
  const { slug } = await params;
  const agenda = await getAgenda();
  const item = agenda.find((entry) => entry.slug === slug);
  return {
    title: item?.title ?? "Agenda"
  };
}

export default async function AgendaDetailPage({ params }: AgendaDetailProps) {
  const { slug } = await params;
  const agenda = await getAgenda();
  const item = agenda.find((entry) => entry.slug === slug);

  if (!item) notFound();

  return (
    <MotionSection>
      <Link href="/agenda" className="inline-flex items-center gap-2 text-sm font-black text-civic hover:text-gold dark:text-gold">
        <ArrowLeft size={16} />
        Back to Agenda
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="glass rounded-lg p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Agenda Detail</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-ink dark:text-white">{item.title}</h1>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
          {item.pdfUrl && (
            <Button href={item.pdfUrl} variant="secondary" className="mt-6">
              <FileText size={17} />
              Open PDF
            </Button>
          )}
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-slate-200 bg-ink dark:border-white/10">
          <Image
            src={item.imageUrl || "/images/coalition-banner.jpeg"}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover opacity-88"
          />
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-lg p-6">
          <h2 className="text-2xl font-black">Objectives</h2>
          <ul className="mt-5 grid gap-3">
            {item.objectives.map((objective) => (
              <li key={objective} className="flex gap-3 rounded-lg bg-white/60 p-3 text-sm font-semibold leading-6 dark:bg-white/7">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-lg p-6">
          <h2 className="text-2xl font-black">Benefits</h2>
          <ul className="mt-5 grid gap-3">
            {item.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3 rounded-lg bg-white/60 p-3 text-sm font-semibold leading-6 dark:bg-white/7">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-gold" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MotionSection>
  );
}
