import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google"

import { MotionProvider } from "@/components/motion/motion-provider"
import { ThemeProvider, themeScript } from "@/components/theme/theme"
import { PageTransitionProvider } from "@/components/transition/page-transition"
import { siteConfig } from "@/lib/site"
import "./globals.css"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
})

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Framesly: cull, deliver and sell wedding photos from one upload",
    template: "%s · Framesly",
  },
  description: siteConfig.description,
  openGraph: { type: "website", siteName: siteConfig.name },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "light dark",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme script sets data-theme before React hydrates, so the server
      // and client markup differ on <html> only, by design.
      suppressHydrationWarning
      className={`${bricolage.variable} ${figtree.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Sets light/Darkroom before first paint: no flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <ThemeProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
