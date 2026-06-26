import { MotionSection } from "@/components/motion-section";
import { NoticePortal } from "@/components/notices/notice-portal";
import { PageHero } from "@/components/page-hero";
import { getNotices } from "@/lib/server-data";

export const metadata = {
  title: "Notices"
};

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <PageHero
        eyebrow="Notices"
        title="Professional notice portal."
        body="Search, filter and read official updates from the coalition."
      />
      <MotionSection>
        <NoticePortal notices={notices} />
      </MotionSection>
    </>
  );
}
