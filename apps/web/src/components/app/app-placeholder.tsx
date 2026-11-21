import { EdgeLabel } from "@/components/ui/card"

/** Stand-in for app screens planned in the Week 1 tickets. */
export function AppPlaceholder({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-[var(--container-content)]">
      <EdgeLabel tone="safelight">Coming in Week 1 · {eyebrow}</EdgeLabel>
      <h1 className="mt-2 type-heading-1 md:type-display-l">{title}</h1>
      <p className="mt-4 max-w-xl type-body-l text-ink-muted">{body}</p>
    </div>
  )
}
