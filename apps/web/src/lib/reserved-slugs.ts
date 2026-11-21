/**
 * Client galleries live at /{studio}/{gallery}. Static routes win in Next.js,
 * so a studio address equal to one of these first path segments would never
 * be reachable.
 *
 * Keep in sync with public.is_reserved_slug() in
 * supabase/migrations/20261121000000_week1_core_schema.sql (the database
 * enforces the same list).
 */
export const RESERVED_STUDIO_SLUGS = new Set([
  "app", "api", "auth", "login", "signup", "logout", "pricing", "video", "sample", "legal",
  "opengraph-image", "twitter-image", "robots.txt", "sitemap.xml", "favicon.ico", "_next",
  "about", "blog", "help", "support", "contact", "careers", "press", "docs", "status",
  "account", "settings", "admin", "dashboard", "onboarding", "studio", "studios", "gallery",
  "galleries", "store", "shop", "checkout", "billing", "features", "compare", "terms",
  "privacy", "www", "framesly", "reset-password", "forgot-password",
])

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "")
}

/** Same rule as the database check: 3–40 chars, a-z 0-9 and inner hyphens, not reserved. */
export function validateStudioSlug(slug: string): string | null {
  if (slug.length < 3) return "Use at least 3 letters or numbers."
  if (slug.length > 40) return "Use 40 characters or fewer."
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(slug)) {
    return "Use lowercase letters, numbers and hyphens, starting and ending with a letter or number."
  }
  if (RESERVED_STUDIO_SLUGS.has(slug)) return "That address is reserved. Try another."
  return null
}
