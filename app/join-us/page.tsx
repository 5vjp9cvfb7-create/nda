import { JoinForm } from "@/components/forms/join-form";
import { MotionSection } from "@/components/motion-section";
import { PageHero } from "@/components/page-hero";

export const metadata = {
  title: "Join Us"
};

export default function JoinUsPage() {
  return (
    <>
      <PageHero
        eyebrow="Join Us"
        title="Become part of the movement."
        body="Submit your details, skills and reason for joining. Admins can review applications from the dashboard."
      />
      <MotionSection>
        <JoinForm />
      </MotionSection>
    </>
  );
}
