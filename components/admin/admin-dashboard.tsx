"use client";

import {
  BarChart3,
  Download,
  FileText,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  PenSquare,
  Plus,
  Save,
  Trash2,
  Upload,
  UsersRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { signOut } from "firebase/auth";
import { Button, EmptyState } from "@/components/ui";
import {
  defaultAgenda,
  defaultContent,
  defaultLeaders,
  defaultMedia,
  defaultNotices,
  defaultStats
} from "@/lib/data";
import { auth, db, isFirebaseConfigured, storage } from "@/lib/firebase/client";
import type {
  AgendaItem,
  ContactMessage,
  Leader,
  MediaAsset,
  MembershipApplication,
  Notice,
  SiteContent,
  Stat
} from "@/lib/types";
import { cn, slugify, toCsv } from "@/lib/utils";

type Tab =
  | "overview"
  | "media"
  | "content"
  | "agenda"
  | "leadership"
  | "notices"
  | "messages"
  | "members";

type AdminState = {
  stats: Stat[];
  content: SiteContent;
  agenda: AgendaItem[];
  leaders: Leader[];
  notices: Notice[];
  media: MediaAsset[];
  messages: ContactMessage[];
  members: MembershipApplication[];
};

const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={17} /> },
  { id: "media", label: "Media", icon: <ImagePlus size={17} /> },
  { id: "content", label: "Homepage & About", icon: <PenSquare size={17} /> },
  { id: "agenda", label: "Agenda", icon: <Megaphone size={17} /> },
  { id: "leadership", label: "Leadership", icon: <UsersRound size={17} /> },
  { id: "notices", label: "Notices", icon: <FileText size={17} /> },
  { id: "messages", label: "Messages", icon: <MessageSquare size={17} /> },
  { id: "members", label: "Members", icon: <BarChart3 size={17} /> }
];

const mediaTypes: MediaAsset["type"][] = [
  "Leader Photos",
  "Gallery Photos",
  "Homepage Images",
  "Event Images",
  "Agenda Images",
  "Notice Attachments"
];

const noticeCategories: Notice["category"][] = ["General", "Academic", "Event", "Urgent"];

function cloneDefaults(): AdminState {
  return {
    stats: structuredClone(defaultStats),
    content: structuredClone(defaultContent),
    agenda: structuredClone(defaultAgenda),
    leaders: structuredClone(defaultLeaders),
    notices: structuredClone(defaultNotices),
    media: structuredClone(defaultMedia),
    messages: [],
    members: []
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeId(prefix: string, label: string) {
  return `${prefix}-${slugify(label)}-${Date.now().toString(36)}`;
}

function downloadCsv(name: string, rows: Array<Record<string, unknown>>) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  children,
  className
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-bold text-ink dark:text-white">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "focus-ring min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-ink dark:border-white/10 dark:bg-white/8 dark:text-white";

const areaClass =
  "focus-ring rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold leading-6 text-ink dark:border-white/10 dark:bg-white/8 dark:text-white";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [state, setState] = useState<AdminState>(() => cloneDefaults());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [noticeQuery, setNoticeQuery] = useState("");
  const [mediaType, setMediaType] = useState<MediaAsset["type"]>("Homepage Images");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!isFirebaseConfigured || !db) {
        const saved = window.localStorage.getItem("nda-ud-admin-state");
        setState(saved ? JSON.parse(saved) : cloneDefaults());
        setLoading(false);
        return;
      }

      const [contentSnap, statsSnap, agendaSnap, leadersSnap, noticesSnap, mediaSnap, messagesSnap, membersSnap] =
        await Promise.all([
          getDoc(doc(db, "siteContent", "main")),
          getDocs(collection(db, "stats")),
          getDocs(collection(db, "agenda")),
          getDocs(collection(db, "leadership")),
          getDocs(collection(db, "notices")),
          getDocs(collection(db, "media")),
          getDocs(collection(db, "contactMessages")),
          getDocs(collection(db, "membershipRequests"))
        ]);

      setState({
        content: contentSnap.exists() ? ({ ...defaultContent, ...contentSnap.data() } as SiteContent) : structuredClone(defaultContent),
        stats: statsSnap.empty ? structuredClone(defaultStats) : statsSnap.docs.map((entry) => entry.data() as Stat),
        agenda: agendaSnap.empty
          ? structuredClone(defaultAgenda)
          : agendaSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as AgendaItem),
        leaders: leadersSnap.empty
          ? structuredClone(defaultLeaders)
          : leadersSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Leader),
        notices: noticesSnap.empty
          ? structuredClone(defaultNotices)
          : noticesSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Notice),
        media: mediaSnap.empty ? structuredClone(defaultMedia) : mediaSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MediaAsset),
        messages: messagesSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ContactMessage),
        members: membersSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as MembershipApplication)
      });
      setLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loading && !isFirebaseConfigured) {
      window.localStorage.setItem("nda-ud-admin-state", JSON.stringify(state));
    }
  }, [loading, state]);

  const filteredNotices = useMemo(() => {
    const query = noticeQuery.trim().toLowerCase();
    return state.notices.filter((notice) => `${notice.title} ${notice.body} ${notice.category}`.toLowerCase().includes(query));
  }, [noticeQuery, state.notices]);

  async function persistCollection<T extends { id?: string }>(collectionName: string, rows: T[]) {
    if (!isFirebaseConfigured || !db) return;
    const activeDb = db;
    await Promise.all(
      rows.map((row) => {
        const id = row.id ?? ("key" in row ? String(row.key) : crypto.randomUUID());
        return setDoc(doc(activeDb, collectionName, id), row, { merge: true });
      })
    );
  }

  async function saveSection(label: string, action: () => Promise<void>) {
    setSaving(label);
    await action();
    setSaving("Saved");
    window.setTimeout(() => setSaving(""), 1400);
  }

  async function uploadMedia(file: File, type: MediaAsset["type"]) {
    setUploading(true);
    const id = makeId("media", file.name);
    let url = URL.createObjectURL(file);

    if (isFirebaseConfigured && storage) {
      const storageRef = ref(storage, `${type.replaceAll(" ", "-").toLowerCase()}/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      url = await getDownloadURL(storageRef);
    }

    const asset: MediaAsset = {
      id,
      name: file.name,
      url,
      type,
      createdAt: new Date().toISOString()
    };

    setState((current) => ({ ...current, media: [asset, ...current.media] }));

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "media", id), asset);
    }

    setUploading(false);
    return url;
  }

  function updateContent(field: keyof SiteContent, value: string | string[]) {
    setState((current) => ({
      ...current,
      content: {
        ...current.content,
        [field]: value
      }
    }));
  }

  function updateAgenda(id: string, patch: Partial<AgendaItem>) {
    setState((current) => ({
      ...current,
      agenda: current.agenda.map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  }

  function updateLeader(id: string, patch: Partial<Leader>) {
    setState((current) => ({
      ...current,
      leaders: current.leaders.map((leader) => (leader.id === id ? { ...leader, ...patch } : leader))
    }));
  }

  function updateNotice(id: string, patch: Partial<Notice>) {
    setState((current) => ({
      ...current,
      notices: current.notices.map((notice) => (notice.id === id ? { ...notice, ...patch } : notice))
    }));
  }

  async function removeDoc(collectionName: string, id: string, updateLocal: () => void) {
    updateLocal();
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, collectionName, id));
    }
  }

  if (loading) {
    return (
      <div className="section-shell py-16">
        <div className="glass rounded-lg p-8 text-center text-sm font-bold text-slate-600 dark:text-slate-300">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <section className="section-shell py-8 sm:py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-ink dark:text-white">NDA x UD Control Center</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {saving && <span className="inline-flex items-center rounded-lg bg-emerald-500/12 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-200">{saving}</span>}
          {auth && (
            <Button
              variant="secondary"
              onClick={async () => {
                const activeAuth = auth;
                if (activeAuth) await signOut(activeAuth);
                window.location.href = "/";
              }}
            >
              <LogOut size={17} />
              Sign Out
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="glass h-fit rounded-lg p-3">
          <div className="grid gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-bold transition",
                  activeTab === tab.id
                    ? "bg-ink text-white dark:bg-gold dark:text-ink"
                    : "text-slate-600 hover:bg-ink/5 dark:text-slate-300 dark:hover:bg-white/8"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          {activeTab === "overview" && (
            <div className="grid gap-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Agenda Items", value: state.agenda.length },
                  { label: "Leaders", value: state.leaders.length },
                  { label: "Notices", value: state.notices.length },
                  { label: "Uploads", value: state.media.length }
                ].map((item) => (
                  <div key={item.label} className="glass rounded-lg p-5">
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-gold">{item.label}</p>
                    <p className="mt-3 text-4xl font-black text-ink dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="glass rounded-lg p-6">
                <h2 className="text-xl font-black">Publish checklist</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    "Add Firebase client keys and service account.",
                    "Create admin users in Firebase Authentication.",
                    "Add SMTP settings to deliver contact emails.",
                    "Upload final NDA, UD and coalition logos.",
                    "Review agenda detail pages before launch.",
                    "Publish the first official notice."
                  ].map((item) => (
                    <div key={item} className="rounded-lg bg-white/60 p-3 text-sm font-semibold text-slate-700 dark:bg-white/7 dark:text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="grid gap-5">
              <div className="glass rounded-lg p-6">
                <h2 className="text-xl font-black">Media Manager</h2>
                <div className="mt-5 grid gap-3 md:grid-cols-[240px_1fr]">
                  <select value={mediaType} onChange={(event) => setMediaType(event.target.value as MediaAsset["type"])} className={inputClass}>
                    {mediaTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <label className="focus-ring flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-4 text-sm font-bold text-ink dark:border-white/15 dark:bg-white/8 dark:text-white">
                    <Upload size={17} />
                    {uploading ? "Uploading..." : "Upload Asset"}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) await uploadMedia(file, mediaType);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.media.map((asset) => (
                  <div key={asset.id} className="glass overflow-hidden rounded-lg">
                    {asset.url.toLowerCase().includes(".pdf") ? (
                      <div className="flex h-44 items-center justify-center bg-ink text-white">
                        <FileText size={44} />
                      </div>
                    ) : (
                      <img src={asset.url} alt={asset.name} className="h-44 w-full object-cover" />
                    )}
                    <div className="p-4">
                      <p className="line-clamp-1 text-sm font-black text-ink dark:text-white">{asset.name}</p>
                      <p className="mt-1 text-xs font-bold text-gold">{asset.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="glass rounded-lg p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black">Homepage and About Page</h2>
                <Button
                  onClick={() =>
                    saveSection("Saving content...", async () => {
                      if (isFirebaseConfigured && db) await setDoc(doc(db, "siteContent", "main"), state.content, { merge: true });
                    })
                  }
                >
                  <Save size={17} />
                  Save Content
                </Button>
              </div>
              <div className="mt-6 grid gap-4">
                <Field label="About Paragraph">
                  <textarea value={state.content.about} onChange={(event) => updateContent("about", event.target.value)} rows={5} className={areaClass} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Vision">
                    <textarea value={state.content.vision} onChange={(event) => updateContent("vision", event.target.value)} rows={5} className={areaClass} />
                  </Field>
                  <Field label="Mission">
                    <textarea value={state.content.mission} onChange={(event) => updateContent("mission", event.target.value)} rows={5} className={areaClass} />
                  </Field>
                </div>
                <Field label="History">
                  <textarea value={state.content.history} onChange={(event) => updateContent("history", event.target.value)} rows={4} className={areaClass} />
                </Field>
                <Field label="Main Coalition Promise">
                  <textarea value={state.content.promise} onChange={(event) => updateContent("promise", event.target.value)} rows={3} className={areaClass} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Objectives (one per line)">
                    <textarea value={state.content.objectives.join("\n")} onChange={(event) => updateContent("objectives", splitLines(event.target.value))} rows={6} className={areaClass} />
                  </Field>
                  <Field label="Future Goals (one per line)">
                    <textarea value={state.content.futureGoals.join("\n")} onChange={(event) => updateContent("futureGoals", splitLines(event.target.value))} rows={6} className={areaClass} />
                  </Field>
                </div>
                <div>
                  <h3 className="text-lg font-black">Statistics</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-4">
                    {state.stats.map((stat) => (
                      <Field key={stat.key} label={stat.label}>
                        <input
                          type="number"
                          min="0"
                          value={stat.value}
                          onChange={(event) =>
                            setState((current) => ({
                              ...current,
                              stats: current.stats.map((entry) => (entry.key === stat.key ? { ...entry, value: Number(event.target.value) } : entry))
                            }))
                          }
                          className={inputClass}
                        />
                      </Field>
                    ))}
                  </div>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() =>
                      saveSection("Saving stats...", async () => {
                        await persistCollection("stats", state.stats.map((stat) => ({ ...stat, id: stat.key })));
                      })
                    }
                  >
                    <Save size={17} />
                    Save Stats
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agenda" && (
            <div className="grid gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black">Manage Agenda</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const title = "New Agenda Item";
                      setState((current) => ({
                        ...current,
                        agenda: [
                          {
                            id: makeId("agenda", title),
                            slug: makeId("agenda", title),
                            title,
                            description: "",
                            objectives: [],
                            benefits: []
                          },
                          ...current.agenda
                        ]
                      }));
                    }}
                  >
                    <Plus size={17} />
                    Add Agenda
                  </Button>
                  <Button onClick={() => saveSection("Saving agenda...", async () => persistCollection("agenda", state.agenda))}>
                    <Save size={17} />
                    Save Agenda
                  </Button>
                </div>
              </div>
              {state.agenda.map((item) => (
                <details key={item.id} className="glass rounded-lg p-5" open={state.agenda.length < 4}>
                  <summary className="cursor-pointer text-lg font-black text-ink dark:text-white">{item.title}</summary>
                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <input
                          value={item.title}
                          onChange={(event) => {
                            const title = event.target.value;
                            updateAgenda(item.id, { title, slug: slugify(title) });
                          }}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Slug">
                        <input value={item.slug} onChange={(event) => updateAgenda(item.id, { slug: slugify(event.target.value) })} className={inputClass} />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea value={item.description} onChange={(event) => updateAgenda(item.id, { description: event.target.value })} rows={3} className={areaClass} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Objectives (one per line)">
                        <textarea value={item.objectives.join("\n")} onChange={(event) => updateAgenda(item.id, { objectives: splitLines(event.target.value) })} rows={5} className={areaClass} />
                      </Field>
                      <Field label="Benefits (one per line)">
                        <textarea value={item.benefits.join("\n")} onChange={(event) => updateAgenda(item.id, { benefits: splitLines(event.target.value) })} rows={5} className={areaClass} />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold dark:border-white/10">
                        <ImagePlus size={17} />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (file) updateAgenda(item.id, { imageUrl: await uploadMedia(file, "Agenda Images") });
                          }}
                        />
                      </label>
                      <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold dark:border-white/10">
                        <FileText size={17} />
                        Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          className="sr-only"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (file) updateAgenda(item.id, { pdfUrl: await uploadMedia(file, "Agenda Images") });
                          }}
                        />
                      </label>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          removeDoc("agenda", item.id, () =>
                            setState((current) => ({ ...current, agenda: current.agenda.filter((entry) => entry.id !== item.id) }))
                          )
                        }
                      >
                        <Trash2 size={17} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}

          {activeTab === "leadership" && (
            <div className="grid gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black">Manage Leadership</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const name = "New Member";
                      setState((current) => ({
                        ...current,
                        leaders: [
                          { id: makeId("leader", name), name, role: "Member", bio: "" },
                          ...current.leaders
                        ]
                      }));
                    }}
                  >
                    <Plus size={17} />
                    Add Member
                  </Button>
                  <Button onClick={() => saveSection("Saving leadership...", async () => persistCollection("leadership", state.leaders))}>
                    <Save size={17} />
                    Save Leadership
                  </Button>
                </div>
              </div>
              <div className="grid gap-4">
                {state.leaders.map((leader) => (
                  <div key={leader.id} className="glass rounded-lg p-5">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Name">
                        <input value={leader.name} onChange={(event) => updateLeader(leader.id, { name: event.target.value })} className={inputClass} />
                      </Field>
                      <Field label="Role">
                        <input value={leader.role} onChange={(event) => updateLeader(leader.id, { role: event.target.value })} className={inputClass} />
                      </Field>
                      <Field label="Photo">
                        <label className="focus-ring flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-white/8">
                          <Upload size={16} />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (file) updateLeader(leader.id, { photoUrl: await uploadMedia(file, "Leader Photos") });
                            }}
                          />
                        </label>
                      </Field>
                    </div>
                    <Field label="Bio" className="mt-4">
                      <textarea value={leader.bio} onChange={(event) => updateLeader(leader.id, { bio: event.target.value })} rows={3} className={areaClass} />
                    </Field>
                    <Button
                      className="mt-4"
                      variant="ghost"
                      onClick={() =>
                        removeDoc("leadership", leader.id, () =>
                          setState((current) => ({ ...current, leaders: current.leaders.filter((entry) => entry.id !== leader.id) }))
                        )
                      }
                    >
                      <Trash2 size={17} />
                      Delete Member
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="grid gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-black">Manage Notices</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const title = "New Notice";
                      setState((current) => ({
                        ...current,
                        notices: [
                          {
                            id: makeId("notice", title),
                            title,
                            body: "",
                            category: "General",
                            createdAt: new Date().toISOString(),
                            pinned: false
                          },
                          ...current.notices
                        ]
                      }));
                    }}
                  >
                    <Plus size={17} />
                    Create Notice
                  </Button>
                  <Button onClick={() => saveSection("Saving notices...", async () => persistCollection("notices", state.notices))}>
                    <Save size={17} />
                    Save Notices
                  </Button>
                </div>
              </div>
              <input
                value={noticeQuery}
                onChange={(event) => setNoticeQuery(event.target.value)}
                placeholder="Search notices"
                className={cn(inputClass, "w-full")}
              />
              {!state.notices.length && <EmptyState title="No notices available." body="Create the first notice here, then save to publish." />}
              {filteredNotices.map((notice) => (
                <div key={notice.id} className="glass rounded-lg p-5">
                  <div className="grid gap-4 md:grid-cols-[1fr_180px_120px]">
                    <Field label="Title">
                      <input value={notice.title} onChange={(event) => updateNotice(notice.id, { title: event.target.value })} className={inputClass} />
                    </Field>
                    <Field label="Category">
                      <select value={notice.category} onChange={(event) => updateNotice(notice.id, { category: event.target.value as Notice["category"] })} className={inputClass}>
                        {noticeCategories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Pinned">
                      <button
                        type="button"
                        onClick={() => updateNotice(notice.id, { pinned: !notice.pinned })}
                        className={cn(inputClass, "justify-center", notice.pinned && "bg-gold text-ink")}
                      >
                        {notice.pinned ? "Yes" : "No"}
                      </button>
                    </Field>
                  </div>
                  <Field label="Body" className="mt-4">
                    <textarea value={notice.body} onChange={(event) => updateNotice(notice.id, { body: event.target.value })} rows={4} className={areaClass} />
                  </Field>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold dark:border-white/10">
                      <ImagePlus size={17} />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (file) updateNotice(notice.id, { imageUrl: await uploadMedia(file, "Notice Attachments") });
                        }}
                      />
                    </label>
                    <label className="focus-ring inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold dark:border-white/10">
                      <FileText size={17} />
                      Upload PDF
                      <input
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (file) updateNotice(notice.id, { pdfUrl: await uploadMedia(file, "Notice Attachments") });
                        }}
                      />
                    </label>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        removeDoc("notices", notice.id, () =>
                          setState((current) => ({ ...current, notices: current.notices.filter((entry) => entry.id !== notice.id) }))
                        )
                      }
                    >
                      <Trash2 size={17} />
                      Delete Notice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "messages" && (
            <DataPanel
              title="Contact Messages"
              emptyTitle="No messages yet."
              rows={state.messages}
              onExport={() => downloadCsv("contact-messages", state.messages as Array<Record<string, unknown>>)}
            />
          )}

          {activeTab === "members" && (
            <DataPanel
              title="Membership Requests"
              emptyTitle="No membership requests yet."
              rows={state.members}
              onExport={() => downloadCsv("membership-requests", state.members as Array<Record<string, unknown>>)}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function DataPanel<T extends Record<string, unknown>>({
  title,
  emptyTitle,
  rows,
  onExport
}: {
  title: string;
  emptyTitle: string;
  rows: T[];
  onExport: () => void;
}) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="glass rounded-lg p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        <Button variant="secondary" onClick={onExport} disabled={!rows.length}>
          <Download size={17} />
          Export CSV
        </Button>
      </div>
      {!rows.length && <div className="mt-5"><EmptyState title={emptyTitle} body="Submitted records will appear here after Firebase is configured." /></div>}
      {rows.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-white/10">
            <thead className="bg-slate-50 dark:bg-white/8">
              <tr>
                {keys.map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {rows.map((row, index) => (
                <tr key={String(row.id ?? index)}>
                  {keys.map((key) => (
                    <td key={key} className="max-w-[260px] px-4 py-3 text-slate-700 dark:text-slate-200">
                      <span className="line-clamp-3">{String(row[key] ?? "")}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
