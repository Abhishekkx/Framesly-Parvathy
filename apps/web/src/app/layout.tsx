import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google"

import { MotionProvider } from "@/components/motion/motion-provider"
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
  openGraph: { type: "website", siteName: siteConfig.name, url: siteConfig.url },
}

export const viewport: Viewport = {
  themeColor: "#f4efe6",
  colorScheme: "dark light",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${figtree.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
