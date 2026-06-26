export type StatKey = "members" | "events" | "campaigns" | "notices";

export type Stat = {
  key: StatKey;
  label: string;
  value: number;
  suffix?: string;
};

export type AgendaItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  objectives: string[];
  benefits: string[];
  imageUrl?: string;
  pdfUrl?: string;
};

export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  category: "General" | "Academic" | "Event" | "Urgent";
  createdAt: string;
  pinned?: boolean;
  pdfUrl?: string;
  imageUrl?: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  url: string;
  type: "Leader Photos" | "Gallery Photos" | "Homepage Images" | "Event Images" | "Agenda Images" | "Notice Attachments";
  createdAt: string;
};

export type SiteContent = {
  about: string;
  vision: string;
  mission: string;
  history: string;
  objectives: string[];
  futureGoals: string[];
  promise: string;
};

export type ContactMessage = {
  id?: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
};

export type MembershipApplication = {
  id?: string;
  fullName: string;
  className: string;
  section: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  reason: string;
  skills: string;
  interests: string;
  createdAt?: string;
};
