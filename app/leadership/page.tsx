import Image from "next/image";
import { UserRoundPlus } from "lucide-react";
import { MotionSection } from "@/components/motion-section";
import { PageHero } from "@/components/page-hero";
import { getLeaders } from "@/lib/server-data";

export const metadata = {
  title: "Leadership"
};

export default async function LeadershipPage() {
  const leaders = await getLeaders();

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="A team shaped by responsibility and service."
        body="Leader photographs and new members can be added from the protected admin dashboard."
      />
      <MotionSection className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {leaders.map((leader) => (
          <article key={leader.id} className="glass overflow-hidden rounded-lg">
            <div className="relative min-h-[280px] bg-civic/10">
              {leader.photoUrl ? (
                <Image src={leader.photoUrl} alt={leader.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              ) : (
                <div className="flex h-[280px] items-center justify-center bg-civic-gradient text-6xl font-black text-white">
                  {leader.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">{leader.role}</p>
              <h2 className="mt-3 text-2xl font-black text-ink dark:text-white">{leader.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{leader.bio}</p>
            </div>
          </article>
        ))}
        <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/45 p-6 text-center dark:border-white/15 dark:bg-white/5">
          <div>
            <UserRoundPlus className="mx-auto text-gold" size={34} />
            <h2 className="mt-4 text-xl font-black">More leaders can be added</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Use the admin dashboard to add members, roles, biographies and photographs.</p>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
