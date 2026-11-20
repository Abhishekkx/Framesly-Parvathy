/**
 * Client galleries live at /{studio}/{gallery}. Static routes win in Next.js,
 * so a studio slug equal to one of these first path segments would never be
 * reachable. Validate on signup here AND in the backend.
 */
export const RESERVED_STUDIO_SLUGS = new Set([
  "app", "api", "login", "signup", "logout", "pricing", "video", "sample", "legal",
  "_next", "favicon.ico", "robots.txt", "sitemap.xml", "opengraph-image", "twitter-image",
  "about", "blog", "help", "support", "contact", "careers", "press", "docs", "status",
  "auth", "account", "settings", "admin", "dashboard", "studio", "studios", "gallery",
  "galleries", "store", "shop", "checkout", "billing", "features", "compare", "terms",
  "privacy", "www", "framesly",
])

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export function validateStudioSlug(slug: string): string | null {
  if (slug.length < 3) return "Use at least 3 letters or numbers."
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) return "Use lowercase letters, numbers and hyphens."
  if (RESERVED_STUDIO_SLUGS.has(slug)) return "That name is reserved. Try another."
  return null
}
