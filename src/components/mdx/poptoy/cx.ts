/** Joins class names, skipping empty ones (a CSS module class may be missing). */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
