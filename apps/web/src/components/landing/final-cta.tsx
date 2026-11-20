import Image from "next/image"

import { RevealText } from "@/components/motion/reveal"
import { ButtonArrow, ButtonLink } from "@/components/ui/button"
import { EdgeLabel } from "@/components/ui/card"
import { photos } from "@/lib/photos"
import { cn } from "@/lib/utils"

const rowA = [photos.brideRed, photos.canopy, photos.riverRock, photos.hennaHands, photos.attire, photos.sherwani, photos.ritual, photos.woods]
const rowB = [photos.lifted, photos.firstDance, photos.toast, photos.dancer, photos.bouquet, photos.archway, photos.field, photos.mono]

/** Picks are marked so the drifting strips read as a culled shoot. */
function Strip({ items, direction, picks }: { items: typeof rowA; direction: "left" | "right"; picks: number[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex w-max gap-2" style={{ animation: `marquee-${direction} 60s linear infinite` }}>
      {doubled.map((p, i) => (
        <div key={i} className={cn("relative h-[120px] w-[96px] shrink-0 sm:h-[160px] sm:w-[128px]", picks.includes(i % items.length) ? "outline-2 -outline-offset-2 outline-safelight" : "opacity-40 grayscale")}>
          <Image src={p.src} alt="" fill sizes="128px" className="object-cover" />
        </div>
      ))}
    </div>
  )
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2 opacity-35 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <Strip items={rowA} direction="left" picks={[0, 2, 5]} />
        <Strip items={rowB} direction="right" picks={[1, 4, 6]} />
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--surface)_30%,transparent_75%)]" />

      <div className="gutter relative mx-auto flex max-w-[var(--container-content)] flex-col items-center text-center">
        <EdgeLabel tone="safelight">Ready when your next wedding is</EdgeLabel>
        <RevealText
          as="h2"
          text="Deliver this weekend's wedding by Monday."
          className="mt-5 max-w-3xl type-display-l text-balance md:type-display-xl"
        />
        <p className="mt-6 max-w-lg type-body-l text-ink-muted">
          Start free. Upload one real wedding and see how many hours come back.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/signup" size="lg" data-cta="final-start-free">
            Start free
            <ButtonArrow />
          </ButtonLink>
          <ButtonLink href="/sample" size="lg" variant="secondary" data-cta="final-sample-gallery">
            See a sample gallery
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
