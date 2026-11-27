import { tinaField } from "tinacms/dist/react";
import type { ProjectNode } from "@/lib/types";
import type { VisibleProject } from "@/lib/visibility";
import Icon from "../Icon";
import Section from "./Section";

export default function Projects({ projects }: { projects: VisibleProject<ProjectNode>[] }) {
  return (
    <Section id="projects" title="Projects">
      <ul className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <li key={p.source.id} data-tina-field={tinaField(p.source)} className="card flex flex-col overflow-hidden">
            {p.image && (
              <img
                src={p.image}
                alt={`Screenshot of ${p.title}`}
                loading="lazy"
                width={640}
                height={360}
                className="aspect-video w-full border-b border-line object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-5">
              {p.category && <p className="mb-1 font-mono text-xs text-accent">{p.category}</p>}
              <h3 className="text-lg font-medium text-ink">{p.title}</h3>
              {p.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>}
              {p.tech.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                  {p.tech.map((t) => (
                    <li key={t} className="tag text-xs">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              {(p.repoUrl || p.demoUrl) && (
                <div className="mt-auto flex gap-4 pt-5 text-sm">
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="link">
                      <Icon name="github" /> Code
                    </a>
                  )}
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="link">
                      <Icon name="external" /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
