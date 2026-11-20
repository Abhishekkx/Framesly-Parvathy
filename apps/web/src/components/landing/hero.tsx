"use client"

import { motion } from "motion/react"

import { ContactSheet } from "@/components/landing/contact-sheet"
import { RevealText } from "@/components/motion/reveal"
import { ButtonArrow, ButtonLink } from "@/components/ui/button"
import { EdgeLabel } from "@/components/ui/card"

const develop = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* The safelight lamp: one warm light source, top left. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[720px] rounded-full opacity-70"
        style={{ background: "radial-gradient(closest-side, rgb(242 169 59 / 0.13), transparent)" }}
      />

      <div className="gutter relative mx-auto grid max-w-[var(--container-content)] grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: develop }}
            className="flex items-center gap-3"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-safelight opacity-60" />
              <span className="relative size-2 rounded-full bg-safelight" />
            </span>
            <EdgeLabel>Paid beta · for wedding photographers</EdgeLabel>
          </motion.div>

          <RevealText
            as="h1"
            immediate
            delay={0.1}
            text="Cull a wedding before dinner."
            className="mt-6 type-display-l text-balance sm:text-[60px] sm:leading-[62px] xl:type-display-xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: develop, delay: 0.45 }}
            className="mt-6 max-w-[30rem] type-body-l text-ink-muted"
          >
            Upload the whole wedding once. Framesly picks the keepers, delivers a gallery in your
            brand, and serves every download from the same files.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: develop, delay: 0.6 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <ButtonLink href="/signup" size="lg" data-cta="hero-start-free">
              Start free
              <ButtonArrow />
            </ButtonLink>
            <ButtonLink href="/sample" size="lg" variant="secondary" data-cta="hero-sample-gallery">
              See a sample gallery
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 grid max-w-md grid-cols-3 border-t border-line pt-5"
          >
            {[
              ["Uploads", "One"],
              ["Shooters", "All of them"],
              ["Days", "As many"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="type-label text-ink-muted">{k}</dt>
                <dd className="mt-1 type-caption text-ink">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="min-w-0 lg:col-span-7"
          initial={{ opacity: 0, y: 40, rotate: 0.6 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: develop, delay: 0.25 }}
        >
          <ContactSheet />
        </motion.div>
      </div>
    </section>
  )
}
