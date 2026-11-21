import type { Metadata } from "next"

import { AppNav } from "@/components/app/app-nav"
import { Wordmark } from "@/components/site/wordmark"
import { ThemeSwitch } from "@/components/theme/theme"
import { TransitionLink } from "@/components/transition/page-transition"

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
}

/**
 * The photographer's app, after login. Darkroom by default (theme script and
 * ThemeProvider treat /app/* as dark unless the user picked a theme).
 *
 * FR-08 shell: left sidebar on desktop, bottom tabs on phones, studio name in
 * the header. Auth protection arrives with FR-03 (proxy.ts in Next.js 16).
 */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface-sunken lg:flex">
        <div className="flex h-16 items-center px-5">
          <TransitionLink href="/" aria-label="Framesly home">
            <Wordmark />
          </TransitionLink>
        </div>
        <AppNav variant="sidebar" />
        <div className="mt-auto space-y-3 border-t border-line p-5">
          <p className="type-label text-ink-muted">Theme</p>
          <ThemeSwitch id="app-sidebar" labels className="flex w-full" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-surface/95 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="lg:hidden">
              <Wordmark compact />
            </span>
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-safelight-soft font-heading text-[13px] font-bold text-safelight-text">
              YS
            </span>
            <div className="min-w-0">
              <p className="truncate type-caption text-ink">Your studio</p>
              <p className="truncate type-label text-[10px] text-ink-muted">Trial · 14 days left</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitch id="app-header" className="lg:hidden" />
            <TransitionLink
              href="/"
              className="flex h-11 items-center rounded-[var(--radius-chip)] px-3 type-caption text-ink-muted transition-colors hover:text-ink"
            >
              Log out
            </TransitionLink>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 pt-8 pb-28 sm:px-6 lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Bottom tabs (phones) */}
      <AppNav variant="tabs" />
    </div>
  )
}
