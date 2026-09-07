/**
 * Small, deliberately minimal set of Handlebars helpers.
 * Keep this list short — logic belongs in controllers/content files,
 * not in templates.
 */
export const hbsHelpers = {
  /** Current year, for copyright lines. */
  year(): number {
    return new Date().getFullYear();
  },

  /** Loose equality check, for the rare template-level conditional. */
  eq(a: unknown, b: unknown): boolean {
    return a === b;
  },

  /** Zero-based index -> "01", "02", … for numbered lists. */
  pad2(index: number): string {
    return String(index + 1).padStart(2, '0');
  },
};
