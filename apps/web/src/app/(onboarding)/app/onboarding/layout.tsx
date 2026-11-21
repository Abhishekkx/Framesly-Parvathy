import { Wordmark } from "@/components/site/wordmark"
import { ThemeArea, ThemeSwitch } from "@/components/theme/theme"
import { signOutAction } from "@/features/auth/actions"

/** Focused first-run layout: no app chrome until the studio exists. Darkroom by default (/app/*). */
export default function OnboardingLayout({ children }: LayoutProps<"/app/onboarding">) {
  return (
    <ThemeArea area="app">
      <div className="grain flex min-h-dvh flex-col">
        <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
          <Wordmark />
          <div className="flex items-center gap-2">
            <ThemeSwitch id="onboarding" />
            <form action={signOutAction}>
              <button type="submit" className="flex h-11 items-center rounded-[var(--radius-chip)] px-3 type-caption text-ink-muted transition-colors hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1120px] flex-1 px-4 pt-6 pb-16 sm:px-8 lg:pt-12">
          {children}
        </main>
      </div>
    </ThemeArea>
  )
}
