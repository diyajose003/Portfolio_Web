/**
 * Rules for what appears on the site. Anything empty, hidden or unsafe is dropped,
 * so the client can leave fields blank without leaving gaps on the page.
 * Content may also be edited straight in Git, so links are re-validated here
 * rather than trusting the admin panel's validation alone.
 */

type Maybe<T> = T | null | undefined;

const EMAIL = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const PDF_EXT = /\.pdf$/i;
const PHONE = /^\+?[0-9 ()-]{7,20}$/;
const WEB3FORMS_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TINA_ASSET_HOST = "assets.tina.io";

export function hasText(value: Maybe<string>): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

interface RichNode {
  type?: string;
  text?: string;
  children?: RichNode[];
}

export function hasRichText(node: Maybe<RichNode>): boolean {
  if (!node) return false;
  if (hasText(node.text)) return true;
  return (node.children ?? []).some((child) => hasRichText(child));
}

/** Returns the link only if it is a well-formed https URL. */
export function safeUrl(value: Maybe<string>): string | null {
  if (!hasText(value)) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function decodes(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/** Returns the path only for files uploaded through the editor. */
export function safeMediaPath(value: Maybe<string>): string | null {
  if (!hasText(value)) return null;
  const v = value.trim();
  if (v.startsWith("/uploads/")) {
    const decoded = decodes(v);
    if (decoded === null || decoded.includes("..") || decoded.includes("\\")) return null;
    return v;
  }
  const url = safeUrl(v);
  return url && new URL(url).hostname === TINA_ASSET_HOST ? url : null;
}

function withExtension(value: Maybe<string>, pattern: RegExp): string | null {
  const path = safeMediaPath(value);
  if (!path) return null;
  const pathname = path.startsWith("/") ? path : new URL(path).pathname;
  return pattern.test(pathname) ? path : null;
}

/** An uploaded image (photo, screenshot). Rejects PDFs and other files. */
export function safeImagePath(value: Maybe<string>): string | null {
  return withExtension(value, IMAGE_EXT);
}

/** An uploaded PDF (résumé). */
export function safePdfPath(value: Maybe<string>): string | null {
  return withExtension(value, PDF_EXT);
}

export function safeEmail(value: Maybe<string>): string | null {
  return hasText(value) && EMAIL.test(value.trim()) ? value.trim() : null;
}

export function safePhone(value: Maybe<string>): string | null {
  return hasText(value) && PHONE.test(value.trim()) ? value.trim() : null;
}

function cleanList(items: Maybe<Maybe<string>[]>): string[] {
  return (items ?? []).filter(hasText).map((s) => s.trim());
}

function byOrder<T extends { order?: Maybe<number> }>(a: T, b: T): number {
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}

function present<T>(items: Maybe<Maybe<T>[]>): T[] {
  return (items ?? []).filter((x): x is T => x != null);
}

export interface ProjectInput {
  title?: Maybe<string>;
  category?: Maybe<string>;
  summary?: Maybe<string>;
  tech?: Maybe<Maybe<string>[]>;
  image?: Maybe<string>;
  repoUrl?: Maybe<string>;
  demoUrl?: Maybe<string>;
  order?: Maybe<number>;
  hidden?: Maybe<boolean>;
}

export interface VisibleProject<T> {
  source: T;
  title: string;
  category: string | null;
  summary: string | null;
  tech: string[];
  image: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
}

export function visibleProjects<T extends ProjectInput>(items: Maybe<Maybe<T>[]>): VisibleProject<T>[] {
  return present(items)
    .filter((p) => !p.hidden && hasText(p.title))
    .sort(byOrder)
    .map((p) => ({
      source: p,
      title: (p.title as string).trim(),
      category: hasText(p.category) ? p.category.trim() : null,
      summary: hasText(p.summary) ? p.summary.trim() : null,
      tech: cleanList(p.tech),
      image: safeImagePath(p.image),
      repoUrl: safeUrl(p.repoUrl),
      demoUrl: safeUrl(p.demoUrl),
    }));
}

export interface EducationInput {
  qualification?: Maybe<string>;
  order?: Maybe<number>;
}

export function visibleEducation<T extends EducationInput>(items: Maybe<Maybe<T>[]>): T[] {
  return present(items).filter((e) => hasText(e.qualification)).sort(byOrder);
}

export interface ExperienceInput {
  role?: Maybe<string>;
  order?: Maybe<number>;
  hidden?: Maybe<boolean>;
}

export function visibleExperience<T extends ExperienceInput>(items: Maybe<Maybe<T>[]>): T[] {
  return present(items).filter((e) => !e.hidden && hasText(e.role)).sort(byOrder);
}

export interface SkillGroupInput {
  name?: Maybe<string>;
  items?: Maybe<Maybe<string>[]>;
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export function visibleSkillGroups(groups: Maybe<Maybe<SkillGroupInput>[]>): SkillGroup[] {
  return present(groups)
    .map((g) => ({ name: hasText(g.name) ? g.name.trim() : "", items: cleanList(g.items) }))
    .filter((g) => g.items.length > 0);
}

export interface ContactInput {
  email?: Maybe<string>;
  phone?: Maybe<string>;
  linkedin?: Maybe<string>;
  github?: Maybe<string>;
  web3formsKey?: Maybe<string>;
}

export interface ContactLinks {
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  formKey: string | null;
  hasAny: boolean;
}

export function contactLinks(input: Maybe<ContactInput>): ContactLinks {
  const c = input ?? {};
  const key = hasText(c.web3formsKey) && WEB3FORMS_KEY.test(c.web3formsKey.trim()) ? c.web3formsKey.trim() : null;
  const links = {
    email: safeEmail(c.email),
    phone: safePhone(c.phone),
    linkedin: safeUrl(c.linkedin),
    github: safeUrl(c.github),
    formKey: key,
  };
  return { ...links, hasAny: Object.values(links).some((v) => v !== null) };
}

export type SectionId = "about" | "skills" | "projects" | "experience" | "education" | "contact";

const SECTION_LABELS: Record<SectionId, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  contact: "Contact",
};

export function navSections(visible: Record<SectionId, boolean>): { id: SectionId; label: string }[] {
  return (Object.keys(SECTION_LABELS) as SectionId[])
    .filter((id) => visible[id])
    .map((id) => ({ id, label: SECTION_LABELS[id] }));
}
