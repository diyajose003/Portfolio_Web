import { tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { Settings } from "@/lib/types";
import Section from "./Section";

export default function About({ settings }: { settings: Settings }) {
  return (
    <Section id="about" title="About">
      <div data-tina-field={tinaField(settings, "about")} className="prose-body max-w-2xl">
        <TinaMarkdown content={settings.about} />
      </div>
    </Section>
  );
}
