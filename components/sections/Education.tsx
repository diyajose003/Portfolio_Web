import { tinaField } from "tinacms/dist/react";
import type { EducationNode } from "@/lib/types";
import { hasText } from "@/lib/visibility";
import { joinParts, period } from "@/lib/format";
import Section from "./Section";
import Timeline, { type TimelineEntry } from "./Timeline";

export default function Education({ items }: { items: EducationNode[] }) {
  const entries: TimelineEntry[] = items.map((e) => ({
    key: e.id,
    tinaField: tinaField(e),
    title: e.qualification,
    subtitle: joinParts([e.institution, e.location]),
    meta: hasText(e.board) ? e.board.trim() : null,
    period: period(e.start, e.end),
    badge: hasText(e.score) ? e.score.trim() : null,
    bullets: [],
  }));
  return (
    <Section id="education" title="Education">
      <Timeline entries={entries} />
    </Section>
  );
}
