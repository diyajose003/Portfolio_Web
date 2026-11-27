export interface TimelineEntry {
  key: string;
  tinaField: string;
  title: string;
  subtitle: string | null;
  meta: string | null;
  period: string | null;
  badge: string | null;
  bullets: string[];
}

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-6">
      {entries.map((e) => (
        <li key={e.key} data-tina-field={e.tinaField} className="relative">
          <span
            className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-page"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <h3 className="font-medium text-ink">{e.title}</h3>
            {e.period && <p className="shrink-0 font-mono text-xs text-muted">{e.period}</p>}
          </div>
          {e.subtitle && <p className="mt-1 text-sm text-ink">{e.subtitle}</p>}
          {e.meta && <p className="mt-0.5 text-sm text-muted">{e.meta}</p>}
          {e.badge && <p className="tag mt-3 inline-block text-xs">{e.badge}</p>}
          {e.bullets.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
