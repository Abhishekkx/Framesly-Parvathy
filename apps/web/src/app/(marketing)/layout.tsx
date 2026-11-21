import { CookieBanner } from "@/components/site/cookie-banner"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { ThemeArea } from "@/components/theme/theme"

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <ThemeArea area="site">
      <>
        <a
          href="#main"
          className="sr-only z-[70] rounded-[var(--radius-chip)] bg-safelight px-4 py-2 text-on-safelight focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
      </>
    </ThemeArea>
  )
}
