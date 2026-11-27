import { tinaField } from "tinacms/dist/react";
import type { Settings } from "@/lib/types";
import { hasText, safeImagePath } from "@/lib/visibility";
import Icon from "../Icon";

interface HeroProps {
  settings: Settings;
  resume: string | null;
  showContact: boolean;
}

export default function Hero({ settings, resume, showContact }: HeroProps) {
  const photo = safeImagePath(settings.photo);
  return (
    <section
      id="top"
      className="container-page flex flex-col-reverse gap-10 py-20 sm:flex-row sm:items-center sm:py-28"
    >
      <div className="flex-1">
        <p className="mb-3 font-mono text-sm text-accent">Hi, I&apos;m</p>
        <h1
          data-tina-field={tinaField(settings, "name")}
          className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        >
          {settings.name}
        </h1>
        {hasText(settings.tagline) && (
          <p data-tina-field={tinaField(settings, "tagline")} className="mt-4 text-lg text-muted sm:text-xl">
            {settings.tagline}
          </p>
        )}
        {hasText(settings.location) && (
          <p
            data-tina-field={tinaField(settings, "location")}
            className="mt-3 flex items-center gap-1.5 text-sm text-muted"
          >
            <Icon name="map" /> {settings.location}
          </p>
        )}
        {(showContact || resume) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {showContact && (
              <a href="#contact" className="btn btn-primary">
                <Icon name="mail" /> Get in touch
              </a>
            )}
            {resume && (
              <a href={resume} download className="btn btn-secondary" data-tina-field={tinaField(settings, "resume")}>
                <Icon name="download" /> Download résumé
              </a>
            )}
          </div>
        )}
      </div>
      {photo && (
        <img
          src={photo}
          alt={`Photo of ${settings.name}`}
          width={176}
          height={176}
          data-tina-field={tinaField(settings, "photo")}
          className="h-36 w-36 rounded-full border border-line object-cover sm:h-44 sm:w-44"
        />
      )}
    </section>
  );
}
