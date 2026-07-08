import { useLang, t } from "@/lib/i18n";

function DocumentCard({
  label,
  children,
  className,
  style,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`pointer-events-none flex flex-col rounded-2xl border border-border bg-card p-4 shadow-xl transition-transform duration-700 ease-out will-change-transform sm:p-5 ${className || ""}`}
      style={style}
    >
      {/* Window chrome */}
      <div className="mb-3 flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-muted" />
        <div className="h-2 w-2 rounded-full bg-muted" />
        <div className="h-2 w-2 rounded-full bg-muted" />
      </div>
      {/* Label */}
      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:mb-4">
        {label}
      </div>
      {children}
    </div>
  );
}

export function SampleReportsSection() {
  const [lang] = useLang();

  return (
    <section className="relative w-full overflow-hidden bg-background px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-3 text-center sm:mb-4">
          <div className="mb-2 inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {t("sampleReportsEyebrow", lang)}
          </div>
          <h2 className="mx-auto max-w-2xl text-xl font-bold leading-tight text-foreground sm:text-2xl">
            {t("sampleReportsTitle", lang)}
          </h2>
        </div>

        {/* Floating document cards */}
        <div className="relative mx-auto flex h-[200px] max-w-[760px] items-start justify-center gap-[-20px] sm:h-[250px]">
          {/* Left card: Markdown */}
          <DocumentCard
            label="Markdown"
            className="absolute left-0 top-2 h-[150px] w-[40%] opacity-75 sm:static sm:mt-4 sm:h-[200px] sm:w-[30%] sm:translate-x-8 sm:rotate-[-6deg] sm:scale-95 sm:opacity-80"
            style={{ transform: "rotateY(18deg) rotateX(4deg) translateZ(-20px)" }}
          >
            <div className="space-y-2.5">
              <div className="h-2 w-3/4 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-5/6 rounded bg-muted" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-muted/50" />
                <div className="h-1.5 w-11/12 rounded bg-muted/50" />
                <div className="h-1.5 w-4/5 rounded bg-muted/50" />
                <div className="h-1.5 w-10/12 rounded bg-muted/50" />
                <div className="h-1.5 w-9/12 rounded bg-muted/50" />
              </div>
              <div className="mt-2 h-1.5 w-2/3 rounded bg-primary/20" />
            </div>
          </DocumentCard>

          {/* Center card: Acceptance Criteria */}
          <DocumentCard
            label="Acceptance Criteria"
            className="relative z-10 h-[170px] w-[46%] shadow-2xl sm:h-[220px] sm:w-[34%]"
          >
            <div className="space-y-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Scenario 1
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full rounded bg-muted/60" />
                <div className="h-1.5 w-11/12 rounded bg-muted/60" />
                <div className="h-1.5 w-4/5 rounded bg-muted/60" />
              </div>
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-primary" />
                  <div className="space-y-1 flex-1">
                    <div className="h-1.5 w-full rounded bg-muted/50" />
                    <div className="h-1.5 w-5/6 rounded bg-muted/50" />
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-primary" />
                  <div className="space-y-1 flex-1">
                    <div className="h-1.5 w-full rounded bg-muted/50" />
                    <div className="h-1.5 w-4/5 rounded bg-muted/50" />
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-muted" />
                  <div className="space-y-1 flex-1">
                    <div className="h-1.5 w-full rounded bg-muted/50" />
                    <div className="h-1.5 w-3/4 rounded bg-muted/50" />
                  </div>
                </div>
              </div>
            </div>
          </DocumentCard>

          {/* Right card: User Story */}
          <DocumentCard
            label="User Story"
            className="absolute right-0 top-2 h-[150px] w-[40%] opacity-75 sm:static sm:mt-4 sm:h-[200px] sm:w-[30%] sm:-translate-x-8 sm:rotate-[6deg] sm:scale-95 sm:opacity-80"
            style={{ transform: "rotateY(-18deg) rotateX(4deg) translateZ(-20px)" }}
          >
            <div className="space-y-2.5">
              <div className="h-2 w-2/3 rounded bg-muted" />
              <div className="h-2 w-full rounded bg-muted" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-muted/50" />
                <div className="h-1.5 w-10/12 rounded bg-muted/50" />
                <div className="h-1.5 w-11/12 rounded bg-muted/50" />
                <div className="h-1.5 w-4/5 rounded bg-muted/50" />
                <div className="h-1.5 w-9/12 rounded bg-muted/50" />
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-1.5 w-14 rounded bg-primary/20" />
                <div className="h-1.5 w-14 rounded bg-primary/20" />
              </div>
            </div>
          </DocumentCard>
        </div>
      </div>
    </section>
  );
}
