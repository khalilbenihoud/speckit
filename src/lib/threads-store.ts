import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "speckit.threads.v1";

function safeRead(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(threads: Thread[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* ignore quota errors */
  }
}

export const threadsStore = {
  list(): Thread[] {
    return safeRead().sort((a, b) => b.updatedAt - a.updatedAt);
  },
  get(id: string): Thread | undefined {
    return safeRead().find((t) => t.id === id);
  },
  upsert(thread: Thread) {
    const all = safeRead().filter((t) => t.id !== thread.id);
    all.unshift(thread);
    safeWrite(all);
    window.dispatchEvent(new Event("speckit:threads"));
  },
  remove(id: string) {
    safeWrite(safeRead().filter((t) => t.id !== id));
    window.dispatchEvent(new Event("speckit:threads"));
  },
  create(): Thread {
    const thread: Thread = {
      id: crypto.randomUUID(),
      title: "New spec",
      updatedAt: Date.now(),
      messages: [],
    };
    this.upsert(thread);
    return thread;
  },
};

export function deriveTitle(messages: UIMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New spec";
  const text = firstUser.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "New spec";
  return text.length > 48 ? text.slice(0, 48) + "…" : text;
}