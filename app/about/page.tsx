import { Goal, History, Rocket, Target } from "lucide-react";
import { MotionSection } from "@/components/motion-section";
import { PageHero } from "@/components/page-hero";
import { Card, SectionHeading } from "@/components/ui";
import { getSiteContent } from "@/lib/server-data";

export const metadata = {
  title: "About"
};

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A coalition for voice, progress and responsible leadership."
        body="NDA x UD exists to turn genuine student concerns into visible, practical action."
      />
      <MotionSection className="grid gap-6 lg:grid-cols-2">
        <Card>
          <History className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black">History</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{content.history}</p>
        </Card>
        <Card>
          <Target className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black">Vision</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{content.vision}</p>
        </Card>
        <Card>
          <Goal className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black">Mission</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{content.mission}</p>
        </Card>
        <Card>
          <Rocket className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black">Future Goals</h2>
          <ul className="mt-3 grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {content.futureGoals.map((goal) => (
              <li key={goal} className="rounded-lg bg-white/60 p-3 dark:bg-white/7">
                {goal}
              </li>
            ))}
          </ul>
        </Card>
      </MotionSection>
      <MotionSection className="pt-0">
        <SectionHeading eyebrow="Objectives" title="What we are working toward." />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {content.objectives.map((objective, index) => (
            <div key={objective} className="glass rounded-lg p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Objective {index + 1}</p>
              <p className="mt-3 font-semibold leading-7 text-ink dark:text-white">{objective}</p>
            </div>
          ))}
        </div>
      </MotionSection>
    </>
  );
}
