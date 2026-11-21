export const siteConfig = {
  name: "Framesly",
  description:
    "Upload a wedding once. Framesly culls it with AI, delivers a gallery in your brand and keeps every file in one place.",
  // Canonical origin for metadata, OG tags, sitemap and robots. Always the
  // launch domain, so previews on *.vercel.app never become canonical.
  url: "https://framesly.app",
} as const

export const marketingNav = [
  { href: "/#how-it-works", label: "Product" },
  { href: "/video", label: "Video" },
  { href: "/pricing", label: "Pricing" },
  { href: "/sample", label: "Sample gallery" },
] as const

/**
 * Per-page canonical + Open Graph URL. A page that sets `openGraph` replaces
 * its parent's whole `openGraph` object, so the shared image is re-attached
 * here or link previews lose it.
 */
export function pageMeta(path: string) {
  return {
    alternates: { canonical: path },
    openGraph: { url: path, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Framesly: cull a wedding before dinner" }] },
  }
}
