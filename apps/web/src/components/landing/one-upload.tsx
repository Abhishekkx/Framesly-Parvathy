"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import Image from "next/image"
import { useRef } from "react"

import { RevealText } from "@/components/motion/reveal"
import { EdgeLabel } from "@/components/ui/card"
import { photos } from "@/lib/photos"

const tools = [
  { name: "Culling app", note: "Desktop only", x: -1, y: -1 },
  { name: "Editor", note: "Export again", x: 1, y: -1 },
  { name: "Gallery host", note: "Upload again", x: -1, y: 1 },
  { name: "Print lab", note: "Upload again", x: 1, y: 1 },
]

/**
 * "The problem" told by scrolling: four tools, four uploads, collapse into a
 * single stored file. The section pins while the boxes converge.
 */
export function OneUpload() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const mapped = useTransform(scrollYProgress, [0.08, 0.7], [0, 1], { clamp: true })
  // Reduced motion: skip the choreography and show the end state.
  const progress = useTransform(mapped, (v) => (reduce ? 1 : v))

  return (
    <section ref={ref} aria-label="The problem" className="relative h-[240vh]">
      <div className="gutter sticky top-0 mx-auto flex h-dvh max-w-[var(--container-content)] flex-col justify-center gap-8 pt-16 md:grid md:grid-cols-12 md:items-center md:gap-12 md:pt-0">
        <div className="md:col-span-5">
          <EdgeLabel tone="safelight">The problem</EdgeLabel>
          <RevealText
            text="A wedding shouldn't need four uploads."
            className="mt-4 type-heading-1 text-balance md:type-display-l"
          />
          <p className="mt-5 hidden max-w-md type-body-l text-ink-muted sm:block">
            A wedding is 2,000 to 15,000 frames. Today they get culled in one app, edited in
            another, uploaded to a gallery host and sent again to a print lab. Every hop is
            another 40 GB upload and another subscription.
          </p>
          <Outcome progress={progress} />
        </div>

        <div className="md:col-span-7">
          <Diagram progress={progress} />
        </div>
      </div>
    </section>
  )
}

function Outcome({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.75, 1], [0, 1])
  const y = useTransform(progress, [0.75, 1], [12, 0])
  return (
    <motion.p style={{ opacity, y }} className="mt-6 border-l-2 border-safelight pl-4 text-ink sm:mt-8 sm:type-body-l">
      With Framesly, culling, the client gallery and downloads all read the same stored file.
    </motion.p>
  )
}

function Diagram({ progress }: { progress: MotionValue<number> }) {
  const mergedOpacity = useTransform(progress, [0.7, 0.95], [0, 1])
  const mergedScale = useTransform(progress, [0.7, 1], [0.86, 1])
  const linesOpacity = useTransform(progress, [0, 0.35], [1, 0])

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(520px,46dvh)] lg:max-w-[min(540px,60dvh)]" aria-hidden>
      {/* Dashed re-upload lines between the four tools */}
      <motion.svg style={{ opacity: linesOpacity }} viewBox="0 0 100 100" className="absolute inset-0 size-full text-line-strong">
        <path d="M28 25 H72 M75 28 V72 M72 75 H28 M25 72 V28" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.4 1.4" fill="none" />
      </motion.svg>

      {tools.map((t, i) => (
        <ToolBox key={t.name} tool={t} index={i} progress={progress} />
      ))}

      {/* The single file they collapse into */}
      <motion.div
        style={{ opacity: mergedOpacity, scale: mergedScale }}
        className="theme-maroon absolute inset-[22%] flex flex-col justify-between rounded-[var(--radius-cover)] border-2 border-safelight p-5 shadow-[var(--shadow-print)]"
      >
        <span className="type-label text-safelight-text">One file in storage</span>
        <div>
          <p className="type-heading-2">DSC_0412.JPG</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Cull", "Gallery", "Download", "Prints"].map((s) => (
              <span key={s} className="rounded-[var(--radius-chip)] bg-safelight-soft px-2 py-0.5 type-label text-safelight-text">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ToolBox({
  tool,
  index,
  progress,
}: {
  tool: (typeof tools)[number]
  index: number
  progress: MotionValue<number>
}) {
  // Each box drifts from its corner to the centre and fades as it merges.
  const x = useTransform(progress, [0, 0.8], ["0%", `${-tool.x * 72}%`])
  const y = useTransform(progress, [0, 0.8], ["0%", `${-tool.y * 72}%`])
  const opacity = useTransform(progress, [0.55, 0.8], [1, 0])
  const rotate = useTransform(progress, [0, 0.8], [tool.x * tool.y * -2, 0])

  const pos = [
    "top-0 left-0",
    "top-0 right-0",
    "bottom-0 left-0",
    "right-0 bottom-0",
  ][index]

  return (
    <motion.div
      style={{ x, y, opacity, rotate }}
      className={`absolute ${pos} flex aspect-square w-[42%] flex-col overflow-hidden rounded-[var(--radius-control)] border border-line bg-surface-raised shadow-[var(--shadow-print)] will-change-transform`}
    >
      {/* The same photo, copied into every tool */}
      <div className="relative min-h-0 flex-1">
        <Image src={photos.riverRock.src} alt="" fill sizes="220px" className="object-cover object-[50%_35%]" />
        <span className="absolute top-2 left-2 rounded-[var(--radius-chip)] bg-[rgb(var(--scrim)/0.7)] px-1.5 py-0.5 type-label text-[9px] text-[#f3ece3]">
          Copy {index + 1}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <p className="type-caption font-semibold text-ink">{tool.name}</p>
        <p className="type-label text-[10px] text-ink-muted">{tool.note}</p>
      </div>
    </motion.div>
  )
}
