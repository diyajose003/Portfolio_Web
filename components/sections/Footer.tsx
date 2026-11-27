import type { ContactLinks } from "@/lib/visibility";
import Icon from "../Icon";

interface FooterProps {
  name: string;
  contact: ContactLinks;
  resume: string | null;
}

export default function Footer({ name, contact, resume }: FooterProps) {
  return (
    <footer className="border-t border-line py-8 text-sm text-muted">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <div className="flex items-center gap-4">
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-ink">
              <Icon name="github" className="h-5 w-5" />
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-ink">
              <Icon name="linkedin" className="h-5 w-5" />
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} aria-label="Email" className="hover:text-ink">
              <Icon name="mail" className="h-5 w-5" />
            </a>
          )}
          {resume && (
            <a href={resume} download className="hover:text-ink">
              Résumé
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
