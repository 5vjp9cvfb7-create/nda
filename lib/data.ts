import type { AgendaItem, Leader, Notice, SiteContent, Stat } from "@/lib/types";

export const contactEmail = "macfrost2811@gmail.com";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/agenda", label: "Agenda" },
  { href: "/leadership", label: "Leadership" },
  { href: "/notices", label: "Notices" },
  { href: "/contact", label: "Contact" },
  { href: "/join-us", label: "Join Us" }
];

export const coreValues = [
  "Leadership",
  "Integrity",
  "Innovation",
  "Transparency",
  "Unity",
  "Equality",
  "Responsibility",
  "Student First"
];

export const defaultStats: Stat[] = [
  { key: "members", label: "Members", value: 0 },
  { key: "events", label: "Events", value: 0 },
  { key: "campaigns", label: "Campaigns", value: 0 },
  { key: "notices", label: "Notices", value: 0 }
];

export const defaultContent: SiteContent = {
  about:
    "NDA x UD is a coalition formed with one purpose-to ensure every student's voice is heard and every genuine concern receives attention. We believe leadership is not about making promises but about delivering meaningful change through transparency, teamwork and responsibility. Together, we aim to build an environment where every student feels respected, represented and empowered to achieve their dreams.",
  vision:
    "To create a school community where every student has equal opportunities, their opinions matter, and leadership is built on trust, innovation and service.",
  mission:
    "Our mission is to represent every student with honesty, solve genuine concerns through practical action, encourage innovation, strengthen student participation and build a positive environment where every student feels heard, respected and inspired.",
  history:
    "NDA x UD brings together young voices committed to student welfare, transparent leadership, practical action and responsible service.",
  objectives: [
    "Represent genuine student concerns with clarity and respect.",
    "Build practical systems for communication, feedback and action.",
    "Create more opportunities for learning, leadership and innovation.",
    "Support a campus culture grounded in trust, equality and belonging."
  ],
  futureGoals: [
    "Launch monthly student dialogue circles.",
    "Create transparent progress reports for every campaign.",
    "Build a stronger bridge between students, teachers and leadership.",
    "Develop innovation and skill-building programs for every interested student."
  ],
  promise:
    "Our agenda is to fulfil your problems, ensure every concern is heard, and work together to provide practical solutions that benefit every student."
};

export const defaultAgenda: AgendaItem[] = [
  {
    id: "student-voice-council",
    slug: "student-voice-council",
    title: "Student Voice Council",
    description: "A structured platform where students can raise ideas, concerns and suggestions with confidence.",
    objectives: ["Create regular representation meetings", "Collect student feedback", "Publish action updates"],
    benefits: ["More responsive leadership", "Clearer student priorities", "Transparent problem resolution"]
  },
  {
    id: "better-communication-between-students-and-teachers",
    slug: "better-communication-between-students-and-teachers",
    title: "Better Communication Between Students and Teachers",
    description: "Practical channels that make it easier to share academic needs and solve classroom concerns.",
    objectives: ["Open feedback channels", "Encourage respectful dialogue", "Reduce communication gaps"],
    benefits: ["Faster clarity", "More trust", "Better academic support"]
  },
  {
    id: "educational-support",
    slug: "educational-support",
    title: "Educational Support",
    description: "Peer learning, resource sharing and support sessions for students who need academic help.",
    objectives: ["Organize study circles", "Share notes and resources", "Support exam preparation"],
    benefits: ["Improved confidence", "Equal learning access", "Stronger academic outcomes"]
  },
  {
    id: "technology-and-ai-initiatives",
    slug: "technology-and-ai-initiatives",
    title: "Technology & AI Initiatives",
    description: "Programs that help students use technology and AI responsibly, creatively and productively.",
    objectives: ["Host AI literacy sessions", "Promote digital skills", "Encourage ethical use"],
    benefits: ["Future-ready students", "Better productivity", "Innovation culture"]
  },
  {
    id: "mental-health-awareness",
    slug: "mental-health-awareness",
    title: "Mental Health Awareness",
    description: "Awareness, support and safe conversations around stress, pressure and emotional well-being.",
    objectives: ["Normalize support-seeking", "Run awareness drives", "Create safe peer networks"],
    benefits: ["Healthier campus culture", "Reduced stigma", "More confident students"]
  },
  {
    id: "clean-and-sustainable-campus",
    slug: "clean-and-sustainable-campus",
    title: "Clean and Sustainable Campus",
    description: "Student-led habits and systems that keep the campus cleaner, greener and more responsible.",
    objectives: ["Promote cleanliness drives", "Encourage waste reduction", "Improve shared spaces"],
    benefits: ["Cleaner campus", "Civic responsibility", "Better everyday environment"]
  },
  {
    id: "student-skill-development",
    slug: "student-skill-development",
    title: "Student Skill Development",
    description: "Practical workshops for communication, confidence, teamwork, design, technology and leadership.",
    objectives: ["Host skill workshops", "Invite mentors", "Create peer-led clubs"],
    benefits: ["Higher confidence", "More capability", "Better opportunities"]
  },
  {
    id: "leadership-opportunities",
    slug: "leadership-opportunities",
    title: "Leadership Opportunities",
    description: "More ways for students to lead initiatives, events and service programs.",
    objectives: ["Create team roles", "Encourage participation", "Mentor new leaders"],
    benefits: ["Shared ownership", "Stronger teams", "Visible growth"]
  },
  {
    id: "monthly-student-activities",
    slug: "monthly-student-activities",
    title: "Monthly Student Activities",
    description: "Regular activities that build connection, creativity, teamwork and campus energy.",
    objectives: ["Plan monthly events", "Invite student suggestions", "Balance fun and learning"],
    benefits: ["More engagement", "Better inclusion", "Memorable campus life"]
  },
  {
    id: "innovation-programs",
    slug: "innovation-programs",
    title: "Innovation Programs",
    description: "Challenges, idea labs and showcases that help students turn ideas into real outcomes.",
    objectives: ["Run idea challenges", "Support project teams", "Showcase student work"],
    benefits: ["Creative confidence", "Problem-solving culture", "New student-led projects"]
  },
  {
    id: "transparent-decision-making",
    slug: "transparent-decision-making",
    title: "Transparent Decision Making",
    description: "Clear updates on commitments, progress, decisions and timelines.",
    objectives: ["Publish progress reports", "Explain decisions", "Track promises publicly"],
    benefits: ["Higher trust", "Accountable leadership", "Reduced confusion"]
  },
  {
    id: "career-awareness-sessions",
    slug: "career-awareness-sessions",
    title: "Career Awareness Sessions",
    description: "Guidance sessions that expose students to pathways, skills and future opportunities.",
    objectives: ["Invite speakers", "Share career resources", "Support informed choices"],
    benefits: ["Better awareness", "More motivation", "Future readiness"]
  },
  {
    id: "student-welfare-initiatives",
    slug: "student-welfare-initiatives",
    title: "Student Welfare Initiatives",
    description: "Practical actions focused on safety, comfort, equal access and everyday student needs.",
    objectives: ["Identify welfare issues", "Prioritize practical solutions", "Follow up regularly"],
    benefits: ["Faster support", "More inclusive campus", "Better student experience"]
  },
  {
    id: "faster-problem-resolution",
    slug: "faster-problem-resolution",
    title: "Faster Problem Resolution",
    description: "A simple process for receiving, tracking and resolving student concerns.",
    objectives: ["Create a concern tracker", "Escalate urgent issues", "Report resolutions"],
    benefits: ["Quicker action", "Less uncertainty", "Stronger accountability"]
  },
  {
    id: "equal-opportunities-for-everyone",
    slug: "equal-opportunities-for-everyone",
    title: "Equal Opportunities For Everyone",
    description: "Fair access to participation, leadership, learning support and recognition.",
    objectives: ["Promote inclusive participation", "Reduce barriers", "Recognize diverse contributions"],
    benefits: ["Fairer campus", "More belonging", "Wider student growth"]
  }
];

export const defaultLeaders: Leader[] = [
  {
    id: "prakhar-prajapati",
    name: "Prakhar Prajapati",
    role: "Leader",
    bio: "Committed to transparent leadership, responsible action and a student-first culture."
  },
  {
    id: "krishika-mehta",
    name: "Krishika Mehta",
    role: "Co-Leader",
    bio: "Focused on inclusion, communication and opportunities that help every student rise."
  }
];

export const defaultNotices: Notice[] = [];

export const defaultMedia = [
  {
    id: "nda-emblem",
    name: "NDA Emblem",
    url: "/images/nda-emblem.jpeg",
    type: "Homepage Images" as const,
    createdAt: new Date().toISOString()
  },
  {
    id: "coalition-banner",
    name: "Coalition Banner",
    url: "/images/coalition-banner.jpeg",
    type: "Homepage Images" as const,
    createdAt: new Date().toISOString()
  },
  {
    id: "nda-campaign-poster",
    name: "NDA Campaign Poster",
    url: "/images/nda-campaign-poster.jpeg",
    type: "Gallery Photos" as const,
    createdAt: new Date().toISOString()
  }
];
