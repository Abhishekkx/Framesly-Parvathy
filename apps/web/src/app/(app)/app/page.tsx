import type { Metadata } from "next"

import { Reveal } from "@/components/motion/reveal"
import { Card, EdgeLabel } from "@/components/ui/card"
import { Viewfinder } from "@/components/ui/viewfinder"

export const metadata: Metadata = { title: "Galleries" }

const metrics = [
  { label: "Galleries", value: "0" },
  { label: "Photos", value: "0" },
  { label: "Storage used", value: "0 GB" },
]

/**
 * Galleries dashboard (FR-08), empty state for now. Real data arrives once
 * Supabase (FR-02) and the create-gallery flow (FR-08) are built.
 */
export default function GalleriesPage() {
  return (
    <div className="mx-auto max-w-[var(--container-content)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <EdgeLabel tone="safelight">Your studio</EdgeLabel>
          <h1 className="mt-2 type-heading-1 md:type-display-l">Galleries</h1>
        </div>
        <button
          type="button"
          disabled
          title="Creating galleries arrives with Week 1 (FR-08)"
          className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-safelight px-5 font-semibold text-on-safelight disabled:opacity-60"
        >
          New gallery
        </button>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-[var(--radius-control)] border border-line bg-surface-raised p-4">
            <dt className="type-label text-ink-muted">{m.label}</dt>
            <dd className="mt-2 type-metric text-[20px] leading-7 text-ink">{m.value}</dd>
          </div>
        ))}
      </dl>

      <Reveal className="mt-8">
        <Card className="grain relative flex flex-col items-center px-6 py-16 text-center" focusFrame={false}>
          <div className="relative grid size-24 place-items-center">
            <Viewfinder size={18} />
            <span className="size-3 rounded-full bg-safelight shadow-[0_0_30px_10px_rgb(242_169_59/0.25)]" />
          </div>
          <h2 className="mt-8 type-heading-1">Create your first gallery</h2>
          <p className="mt-3 max-w-md text-ink-muted">
            Name the wedding, pick the events (Haldi, Sangeet, Ceremony, Reception or your own), then
            drop in every card from every shooter.
          </p>
          <p className="mt-6 type-label text-ink-muted">Gallery creation arrives with Week 1</p>
        </Card>
      </Reveal>
    </div>
  )
}
