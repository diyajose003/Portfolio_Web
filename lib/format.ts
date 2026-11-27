import { hasText } from "./visibility";

type Maybe<T> = T | null | undefined;

/** Joins the non-empty parts with a separator, or returns null if none are set. */
export function joinParts(parts: Maybe<string>[], separator = " · "): string | null {
  const present = parts.filter(hasText).map((p) => p.trim());
  return present.length > 0 ? present.join(separator) : null;
}

/** "2021 – 2025" when both are set, otherwise whichever one exists, or null. */
export function period(start: Maybe<string>, end: Maybe<string>): string | null {
  const s = hasText(start) ? start.trim() : null;
  const e = hasText(end) ? end.trim() : null;
  if (s && e) return `${s} – ${e}`;
  return s ?? e;
}
