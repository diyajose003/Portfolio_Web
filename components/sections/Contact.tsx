import { tinaField } from "tinacms/dist/react";
import type { Settings } from "@/lib/types";
import type { ContactLinks } from "@/lib/visibility";
import ContactForm from "../ContactForm";
import Icon, { type IconName } from "../Icon";
import Section from "./Section";

type ContactField = "email" | "phone" | "linkedin" | "github";

interface ContactLink {
  field: ContactField;
  icon: IconName;
  label: string;
  href: string;
  external: boolean;
}

interface ContactProps {
  settings: Settings;
  contact: ContactLinks;
}

function buildLinks(contact: ContactLinks): ContactLink[] {
  const links: (ContactLink | null)[] = [
    contact.email ? { field: "email", icon: "mail", label: contact.email, href: `mailto:${contact.email}`, external: false } : null,
    contact.phone
      ? { field: "phone", icon: "phone", label: contact.phone, href: `tel:${contact.phone.replace(/[^0-9+]/g, "")}`, external: false }
      : null,
    contact.linkedin ? { field: "linkedin", icon: "linkedin", label: "LinkedIn", href: contact.linkedin, external: true } : null,
    contact.github ? { field: "github", icon: "github", label: "GitHub", href: contact.github, external: true } : null,
  ];
  return links.filter((l): l is ContactLink => l !== null);
}

export default function Contact({ settings, contact }: ContactProps) {
  const links = buildLinks(contact);
  return (
    <Section id="contact" title="Contact">
      <div className={contact.formKey ? "grid gap-10 md:grid-cols-[1fr_1.4fr]" : ""}>
        <div>
          <p className="text-muted">I&apos;m open to full-stack and software developer roles. Feel free to reach out.</p>
          {links.length > 0 && (
            <ul className="mt-6 space-y-3 text-sm">
              {links.map((l) => (
                <li key={l.field} data-tina-field={tinaField(settings, l.field)}>
                  <a
                    href={l.href}
                    className="link"
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon name={l.icon} /> {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {contact.formKey && <ContactForm accessKey={contact.formKey} recipientName={settings.name} />}
      </div>
    </Section>
  );
}
