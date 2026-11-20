import { AuthShowcase } from "@/components/auth/auth-showcase"
import { Wordmark } from "@/components/site/wordmark"
import { TransitionLink } from "@/components/transition/page-transition"

/** Split layout: the form on the left, a live slideshow of culled picks on the right (desktop). */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="grain relative flex flex-col overflow-hidden px-4 py-6 sm:px-10 lg:px-16">
        {/* Soft marigold light behind the form */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-48 -left-40 size-[620px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgb(209 130 0 / 0.12), transparent)" }}
        />
        <TransitionLink href="/" aria-label="Framesly home" className="relative self-start">
          <Wordmark />
        </TransitionLink>
        <main className="relative flex flex-1 items-center py-10">{children}</main>
        <p className="relative type-label text-ink-muted">© 2026 Framesly</p>
      </div>

      <div className="theme-espresso relative hidden p-4 lg:block">
        <AuthShowcase />
      </div>
    </div>
  )
}
