export const siteConfig = {
  name: "Framesly",
  description:
    "Upload a wedding once. Framesly culls it with AI, delivers a gallery in your brand and keeps every file in one place.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://framesly.app",
} as const

export const marketingNav = [
  { href: "/#how-it-works", label: "Product" },
  { href: "/video", label: "Video" },
  { href: "/pricing", label: "Pricing" },
  { href: "/sample", label: "Sample gallery" },
] as const
