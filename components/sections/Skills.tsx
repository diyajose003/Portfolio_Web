import { tinaField } from "tinacms/dist/react";
import type { Skills as SkillsDoc } from "@/lib/types";
import type { SkillGroup } from "@/lib/visibility";
import Section from "./Section";

interface SkillsProps {
  skills: SkillsDoc;
  groups: SkillGroup[];
}

export default function Skills({ skills, groups }: SkillsProps) {
  return (
    <Section id="skills" title="Skills">
      <div data-tina-field={tinaField(skills, "groups")} className="grid gap-6 sm:grid-cols-2">
        {groups.map((group, i) => (
          <div key={`${group.name}-${i}`}>
            {group.name && <h3 className="mb-2 text-sm font-medium text-ink">{group.name}</h3>}
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
