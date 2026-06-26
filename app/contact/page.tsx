import { Mail } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { MotionSection } from "@/components/motion-section";
import { PageHero } from "@/components/page-hero";
import { contactEmail } from "@/lib/data";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Send a concern, suggestion or question." body="The form asks only for your email, subject and message." />
      <MotionSection className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass rounded-lg p-6">
          <Mail className="text-gold" size={28} />
          <h2 className="mt-4 text-2xl font-black">Direct Contact</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Messages are saved to Firebase and sent to the coalition inbox when SMTP is configured.</p>
          <a href={`mailto:${contactEmail}`} className="mt-5 inline-flex text-sm font-black text-civic hover:text-gold dark:text-gold">
            {contactEmail}
          </a>
        </div>
        <ContactForm />
      </MotionSection>
    </>
  );
}
