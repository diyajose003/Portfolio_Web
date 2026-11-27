import { tinaField } from "tinacms/dist/react";
import type { ExperienceNode } from "@/lib/types";
import { hasText } from "@/lib/visibility";
import { joinParts, period } from "@/lib/format";
import Section from "./Section";
import Timeline, { type TimelineEntry } from "./Timeline";

function endLabel(start?: string | null, end?: string | null): string | null {
  if (hasText(end)) return end;
  return hasText(start) ? "Present" : null;
}

export default function Experience({ items }: { items: ExperienceNode[] }) {
  const entries: TimelineEntry[] = items.map((e) => ({
    key: e.id,
    tinaField: tinaField(e),
    title: e.role,
    subtitle: joinParts([e.company, e.location]),
    meta: null,
    period: period(e.start, endLabel(e.start, e.end)),
    badge: null,
    bullets: (e.highlights ?? []).filter(hasText).map((h) => h.trim()),
  }));
  return (
    <Section id="experience" title="Experience">
      <Timeline entries={entries} />
    </Section>
  );
}
