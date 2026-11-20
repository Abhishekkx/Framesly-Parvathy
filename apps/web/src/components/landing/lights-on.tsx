"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import Image from "next/image"
import { useRef } from "react"

import { Reveal, RevealText } from "@/components/motion/reveal"
import { TextLink } from "@/components/ui/button"
import { EdgeLabel } from "@/components/ui/card"
import { photos } from "@/lib/photos"
import { cn } from "@/lib/utils"

const points = [
  { n: "01", title: "Your logo, never ours", body: "Your mark sits top left. Framesly is one quiet line in the footer." },
  { n: "02", title: "One section per event", body: "Haldi, sangeet, ceremony, reception. Clients jump straight to the day they want." },
  { n: "03", title: "Two buttons per photo", body: "Favourite and download. Nothing else gets between your client and the picture." },
  { n: "04", title: "Looks right when shared", body: "Links preview with the cover and names in WhatsApp, iMessage and email." },
]

const masonry = [
  photos.sherwani, photos.canopy, photos.brideGold, photos.hennaHands,
  photos.riverRock, photos.ritual, photos.attire, photos.rings, photos.traditional,
]

/**
 * Section change: the page is in Darkroom; scrolling in "switches the lights
 * on" with a circle that opens from the top and reveals the Print theme, the
 * way clients see their gallery.
 */
export function LightsOn() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.15"] })
  const radius = useTransform(scrollYProgress, [0, 1], [reduce ? 160 : 0, 160])
  const clipPath = useTransform(radius, (r) => `circle(${r}% at 50% 0%)`)

  const { scrollYProgress: inner } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const phoneY = useTransform(inner, [0, 1], reduce ? [0, 0] : [120, -120])
  const browserY = useTransform(inner, [0, 1], reduce ? [0, 0] : [40, -40])

  return (
    <section ref={ref} aria-labelledby="lights-title" className="relative bg-surface">
      <motion.div style={{ clipPath }} className="theme-print relative">
        <div className="gutter mx-auto max-w-[var(--container-content)] py-24 md:py-32">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <EdgeLabel tone="safelight">Client gallery</EdgeLabel>
              <RevealText
                as="h2"
                text="Lights on for your clients."
                className="mt-4 type-heading-1 text-balance md:type-display-l"
              />
            </div>
            <p className="max-w-md type-body-l text-ink-muted md:col-span-5">
              The dashboard stays in the dark room. Your clients get a bright, quiet gallery that
              looks like your studio made it.
            </p>
          </div>

          {/* Desktop browser + phone */}
          <div className="relative mt-16 md:mt-20">
            <motion.div style={{ y: browserY }} className="overflow-hidden rounded-[var(--radius-cover)] border border-line bg-surface-raised shadow-[0_50px_100px_-50px_rgb(22_25_31/0.45)] md:mr-[12%]">
              <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-line" />
                  <span className="size-2.5 rounded-full bg-line" />
                  <span className="size-2.5 rounded-full bg-line" />
                </span>
                <span className="mx-auto truncate rounded-[var(--radius-chip)] bg-surface-sunken px-3 py-1 type-label text-[10px] text-ink-muted">
                  framesly.app/saffron-lane/aarohi-kabir
                </span>
              </div>
              <div className="relative h-[220px] sm:h-[320px]">
                <Image src={photos.window.src} alt="Gallery cover: bride standing near a window" fill sizes="(min-width: 768px) 900px, 100vw" className="object-cover object-[50%_30%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(22_25_31/0.7)] via-[rgb(22_25_31/0.1)] to-[rgb(22_25_31/0.3)]" />
                <p className="absolute top-5 left-5 font-heading text-[13px] font-bold tracking-[0.25em] text-white uppercase">Saffron Lane</p>
                <div className="absolute bottom-6 left-5 text-white sm:left-8">
                  <p className="font-heading text-[32px] leading-none font-bold tracking-[-0.02em] sm:text-[48px]">Aarohi & Kabir</p>
                  <p className="mt-2 type-label text-white/80">Udaipur · 12 to 14 February</p>
                </div>
              </div>
              <div className="flex gap-6 overflow-x-auto border-b border-line px-5 sm:px-8">
                {["Haldi", "Mehendi", "Sangeet", "Ceremony", "Reception"].map((s, i) => (
                  <span key={s} className={cn("relative py-3 type-caption whitespace-nowrap", i === 3 ? "text-ink" : "text-ink-muted")}>
                    {s}
                    {i === 3 && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />}
                  </span>
                ))}
              </div>
              <div className="columns-3 gap-2 p-2 sm:columns-4 md:columns-5">
                {masonry.map((p) => (
                  <div key={p.id} className="group relative mb-2 break-inside-avoid">
                    <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 768px) 200px, 33vw" className="h-auto w-full" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              style={{ y: phoneY }}
              className="absolute -right-1 -bottom-16 hidden w-[210px] overflow-hidden rounded-[30px] border border-line-strong bg-ink p-1.5 shadow-[0_40px_80px_-30px_rgb(22_25_31/0.6)] md:block lg:w-[240px]"
            >
              <div className="overflow-hidden rounded-[24px] bg-surface">
                <div className="relative h-[180px]">
                  <Image src={photos.sherwani.src} alt="" fill sizes="240px" className="object-cover object-[50%_25%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(22_25_31/0.7)] to-transparent" />
                  <p className="absolute bottom-3 left-3 font-heading text-[18px] leading-5 font-bold text-white">Aarohi & Kabir</p>
                </div>
                <div className="grid grid-cols-2 gap-0.5 p-0.5">
                  {[photos.brideRed, photos.canopy, photos.riverRock, photos.attire].map((p) => (
                    <div key={p.id} className="relative aspect-square">
                      <Image src={p.src} alt="" fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <ol className="mt-24 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {points.map((pt, i) => (
              <Reveal as="li" key={pt.n} delay={i * 0.06} className="bg-surface p-6">
                <p className="type-metric text-safelight-text">{pt.n}</p>
                <h3 className="mt-6 type-heading-2">{pt.title}</h3>
                <p className="mt-2 text-ink-muted">{pt.body}</p>
              </Reveal>
            ))}
          </ol>

          <div className="mt-10">
            <TextLink href="/sample">Open the sample gallery</TextLink>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
