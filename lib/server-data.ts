import {
  defaultAgenda,
  defaultContent,
  defaultLeaders,
  defaultNotices,
  defaultStats
} from "@/lib/data";
import { getAdminDb } from "@/lib/firebase/server";
import type { AgendaItem, Leader, Notice, SiteContent, Stat } from "@/lib/types";

async function getCollection<T>(name: string, fallback: T[]) {
  const db = getAdminDb();
  if (!db) return fallback;

  try {
    const snapshot = await db.collection(name).get();
    if (snapshot.empty) return fallback;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
  } catch {
    return fallback;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = getAdminDb();
  if (!db) return defaultContent;

  try {
    const snapshot = await db.collection("siteContent").doc("main").get();
    return snapshot.exists ? ({ ...defaultContent, ...snapshot.data() } as SiteContent) : defaultContent;
  } catch {
    return defaultContent;
  }
}

export async function getStats(): Promise<Stat[]> {
  return getCollection<Stat>("stats", defaultStats);
}

export async function getAgenda(): Promise<AgendaItem[]> {
  const items = await getCollection<AgendaItem>("agenda", defaultAgenda);
  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getLeaders(): Promise<Leader[]> {
  return getCollection<Leader>("leadership", defaultLeaders);
}

export async function getNotices(): Promise<Notice[]> {
  const notices = await getCollection<Notice>("notices", defaultNotices);
  return notices.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getLatestNotices(count = 3) {
  return (await getNotices()).slice(0, count);
}
