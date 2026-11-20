"use client"

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { CullVisual, DeliverVisual, UploadVisual } from "@/components/landing/step-visuals"
import { RevealText } from "@/components/motion/reveal"
import { EdgeLabel } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const steps = [
  {
    n: "01",
    title: "Upload once",
    body: "Drag in every card from every shooter. Files go straight to storage in parts, so a dropped connection picks up where it stopped instead of starting over.",
    detail: ["2,000+ files per upload", "Resumes after a drop", "EXIF read for every frame"],
    Visual: UploadVisual,
  },
  {
    n: "02",
    title: "Cull to the number you want",
    body: "Say how many photos to deliver. Framesly removes blur, closed eyes and near-duplicates, keeps the best of each burst, and tells you why it chose each one. You overrule anything.",
    detail: ["Blur and closed-eye checks", "Burst and duplicate grouping", "A reason on every decision"],
    Visual: CullVisual,
  },
  {
    n: "03",
    title: "Deliver in your brand",
    body: "Publish a private gallery with your logo and colours, one section per event. Clients favourite and download from the same files you uploaded. Nothing is copied twice.",
    detail: ["PIN and expiry", "ZIP downloads by email", "Previews in WhatsApp"],
    Visual: DeliverVisual,
  },
]

const develop = [0.22, 1, 0.36, 1] as const

/**
 * Scrollytelling: the step copy scrolls on the left while the matching visual
 * stays pinned on the right and swaps as each step crosses the middle of the
 * screen. Below `lg`, each step shows its own visual inline.
 */
export function HowItWorks() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] })
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
        })
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    stepRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const ActiveVisual = steps[active].Visual

  return (
    <section ref={ref} id="how-it-works" aria-labelledby="how-title" className="relative py-24 md:py-32">
      <div className="gutter mx-auto max-w-[var(--container-content)]">
        <div className="max-w-2xl">
          <EdgeLabel tone="safelight">How it works</EdgeLabel>
          <RevealText as="h2" text="Three steps. One upload." className="mt-4 type-heading-1 md:type-display-l" />
        </div>

        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Steps */}
          <div className="relative min-w-0 lg:col-span-5">
            {/* Progress rail */}
            <div aria-hidden className="absolute top-0 bottom-0 left-[11px] hidden w-px bg-line lg:block">
              <motion.div className="h-full w-full origin-top bg-safelight" style={{ scaleY: rail }} />
            </div>

            {steps.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                data-step={i}
                className="relative lg:flex lg:min-h-[78vh] lg:items-center lg:pl-12"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 left-0 hidden size-[23px] -translate-y-1/2 place-items-center border bg-surface transition-colors duration-500 lg:grid",
                    active === i ? "border-safelight" : "border-line"
                  )}
                >
                  <span className={cn("size-[7px] transition-colors duration-500", active === i ? "bg-safelight" : "bg-line")} />
                </span>

                <div
                  className={cn(
                    "transition-opacity duration-500",
                    active === i ? "lg:opacity-100" : "lg:opacity-35"
                  )}
                >
                  <p className="type-metric text-safelight-text">{s.n}</p>
                  <h3 className="mt-3 type-heading-1">{s.title}</h3>
                  <p className="mt-4 max-w-md type-body-l text-ink-muted">{s.body}</p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5">
                    {s.detail.map((d) => (
                      <li key={d} className="flex items-center gap-3 type-caption text-ink">
                        <span aria-hidden className="h-px w-4 bg-safelight" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 lg:hidden">
                    <s.Visual />
                  </div>
                </div>
                {i < steps.length - 1 && <div className="h-20 lg:hidden" />}
              </div>
            ))}
          </div>

          {/* Pinned visual (desktop) */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(50dvh-260px)] flex min-h-[520px] items-center">
              <div className="relative w-full">
                <p aria-hidden className="pointer-events-none absolute -top-10 right-0 font-heading text-[180px] leading-none font-bold tracking-[-0.06em] text-surface-raised select-none">
                  {steps[active].n}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="relative"
                    initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
                    animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                    exit={{ opacity: 0, y: -20, clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 0.55, ease: develop }}
                  >
                    <ActiveVisual />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
