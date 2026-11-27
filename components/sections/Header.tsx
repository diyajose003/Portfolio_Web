import type { SectionId } from "@/lib/visibility";

interface HeaderProps {
  name: string;
  sections: { id: SectionId; label: string }[];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Header({ name, sections }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/85 backdrop-blur">
      <nav aria-label="Main" className="container-page flex h-14 items-center justify-between gap-4">
        <a href="#top" className="font-semibold tracking-tight text-ink" aria-label={`${name}, back to top`}>
          {initials(name)}
        </a>
        {sections.length > 0 && (
          <ul className="flex gap-4 overflow-x-auto text-sm text-muted sm:gap-6">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="whitespace-nowrap transition-colors hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
