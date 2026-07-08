import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUp, BookOpen, Code2, FileText, Mic, Plus, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { SampleReportsSection } from "@/components/sample-reports-section";
import { threadsStore } from "@/lib/threads-store";
import { getSuggestions, t, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [lang] = useLang();
  const [mode, setMode] = useState<"generate" | "paste">("generate");
  const [value, setValue] = useState("");
  const suggestions = getSuggestions(lang);

  useEffect(() => {
    // Prefetch check — but do NOT auto-navigate; landing must be visible.
  }, [navigate]);

  const startWithText = (text?: string) => {
    const thread = threadsStore.create();
    if (text && text.trim() && typeof window !== "undefined") {
      window.sessionStorage.setItem(`speckit.pending.${thread.id}`, text.trim());
    }
    navigate({ to: "/$threadId", params: { threadId: thread.id } });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    startWithText(value);
  };

  return (
    <>
      <div className="bg-speckit-pattern flex w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-center font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {t("heroTitle", lang)}
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("landingLede", lang)}
        </p>

        {/* Mode toggle */}
        <div className="mx-auto mt-8 flex w-fit items-center gap-1 rounded-full border border-border/70 bg-secondary/60 p-1 shadow-sm">
          <ModeButton
            active={mode === "generate"}
            onClick={() => setMode("generate")}
            icon={<Sparkles className="h-4 w-4" />}
            label={t("modeGenerate", lang)}
          />
          <ModeButton
            active={mode === "paste"}
            onClick={() => setMode("paste")}
            icon={<Code2 className="h-4 w-4" />}
            label={t("modePaste", lang)}
          />
        </div>

        {/* Composer */}
        <form
          id="composer"
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border border-border bg-card/95 p-4 shadow-[0_10px_40px_-15px_rgba(0,80,40,0.15)] backdrop-blur"
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("placeholder", lang)}
            rows={4}
            className="w-full resize-none bg-transparent px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("upload", lang)}
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              aria-label={t("send", lang)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <QuickAction icon={<BookOpen className="h-4 w-4" />} label={t("actionTemplates", lang)} onClick={() => startWithText(suggestions[0])} />
          <QuickAction icon={<FileText className="h-4 w-4" />} label={t("actionBlank", lang)} onClick={() => startWithText()} />
          <QuickAction icon={<Mic className="h-4 w-4" />} label={t("actionVoice", lang)} onClick={() => startWithText()} />
        </div>

        {/* Suggestion chips */}
        <div className="mt-8 grid gap-2 sm:grid-cols-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => startWithText(s)}
              className="rounded-xl border border-border bg-card/70 px-4 py-3 text-left text-sm text-card-foreground transition hover:border-primary/40 hover:bg-secondary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
      <SampleReportsSection />
    </>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition",
        active
          ? "bg-foreground text-background shadow"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary"
    >
      {icon}
      {label}
    </button>
  );
}
