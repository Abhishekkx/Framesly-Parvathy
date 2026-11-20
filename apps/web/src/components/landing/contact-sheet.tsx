"use client"

import { animate, motion, useInView, useReducedMotion } from "motion/react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

import { Chip } from "@/components/ui/card"
import { Viewfinder } from "@/components/ui/viewfinder"
import { photos, type Photo } from "@/lib/photos"
import { cn, frameNo } from "@/lib/utils"

type Frame = {
  photo: Photo
  n: number
  verdict: "pick" | "reject"
  reason?: string
  /** Shot is soft: rendered blurred so the reason is visible. */
  soft?: boolean
  /** Burst neighbour: same scene, slightly different framing. */
  crop?: string
}

const frames: Frame[] = [
  { photo: photos.brideRed, n: 408, verdict: "pick" },
  { photo: photos.hennaHands, n: 409, verdict: "reject", reason: "Blur", soft: true },
  { photo: photos.canopy, n: 410, verdict: "pick", crop: "50% 50%" },
  { photo: photos.canopy, n: 411, verdict: "reject", reason: "Dup of 0410", crop: "62% 40%" },
  { photo: photos.riverRock, n: 412, verdict: "pick" },
  { photo: photos.ritual, n: 413, verdict: "reject", reason: "Eyes closed" },
  { photo: photos.brideGold, n: 414, verdict: "pick", crop: "50% 30%" },
  { photo: photos.brideGold, n: 415, verdict: "reject", reason: "Dup of 0414", crop: "45% 45%" },
  { photo: photos.sherwani, n: 416, verdict: "pick" },
  { photo: photos.rings, n: 417, verdict: "reject", reason: "Blur", soft: true },
  { photo: photos.flowerCanopy, n: 418, verdict: "pick" },
  { photo: photos.crown, n: 419, verdict: "reject", reason: "Eyes closed" },
]

const SCAN = 2.6 // seconds for the scan line to cross the sheet
const START = 0.5

/**
 * Hero visual: a contact sheet being culled.
 * A safelight scan line passes over the frames; rejects dim with the reason,
 * picks get viewfinder brackets. Plays once when visible; "Run again" replays.
 */
export function ContactSheet() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = useReducedMotion()
  const [run, setRun] = useState(0)
  const [rawPhase, setPhase] = useState<"idle" | "scan" | "done">("idle")
  const [rawScored, setScored] = useState(0)
  // Reduced motion: skip the scan and show the finished cull.
  const phase = reduce && inView ? "done" : rawPhase
  const scored = reduce && inView ? 2184 : rawScored

  const play = useCallback(() => {
    setPhase("idle")
    setScored(0)
    setRun((r) => r + 1)
  }, [])

  useEffect(() => {
    if (!inView || reduce) return
    const start = setTimeout(() => setPhase("scan"), 0)
    const counter = animate(0, 2184, {
      duration: SCAN,
      delay: START,
      ease: "linear",
      onUpdate: (v) => setScored(Math.round(v)),
    })
    const t = setTimeout(() => setPhase("done"), (START + SCAN + 0.3) * 1000)
    return () => {
      clearTimeout(start)
      counter.stop()
      clearTimeout(t)
    }
  }, [inView, reduce, run])

  // Measure the sheet so the scan line travels exactly its height.
  const listRef = useRef<HTMLOListElement>(null)
  const [sheetH, setSheetH] = useState(640)
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSheetH(el.clientHeight + 24))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Readout bar */}
      <div className="flex items-center justify-between gap-3 rounded-t-[var(--radius-cover)] border border-b-0 border-line bg-surface-raised px-4 py-3">
        <div className="min-w-0">
          <p className="truncate type-label text-ink-muted">
            Aarohi + Kabir<span className="hidden sm:inline"> · Day 2 · Ceremony</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <p className="type-metric text-[12px] whitespace-nowrap text-ink sm:text-[14px]" aria-live="polite">
            {phase === "done" ? (
              <>
                <span className="text-safelight-text">612</span> picks · 41 min
              </>
            ) : (
              <>
                {scored.toLocaleString("en-US")}
                <span className="text-ink-muted"> / 2,184 scored</span>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={play}
            disabled={phase === "scan"}
            aria-label="Run the cull again"
            className="group grid size-11 place-items-center rounded-[var(--radius-chip)] text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:opacity-40 sm:size-9"
          >
            <svg viewBox="0 0 20 20" className="size-4 transition-[rotate] duration-500 group-active:-rotate-180" aria-hidden>
              <path d="M16 10a6 6 0 1 1-1.76-4.24M16 4v3.5h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sheet */}
      <div className="relative overflow-hidden rounded-b-[var(--radius-cover)] border border-line bg-surface-sunken p-2 sm:p-3">
        <ol ref={listRef} className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {frames.map((f, i) => {
            const at = START + (i / frames.length) * SCAN
            const show = phase === "done" || phase === "scan"
            return (
              <li key={`${run}-${f.n}`} className="relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={f.photo.src}
                    alt={f.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 30vw"
                    className={cn("object-cover", f.soft && "blur-[2px] scale-105")}
                    style={{ objectPosition: f.crop }}
                    priority={i < 4}
                  />
                  {/* Reject treatment */}
                  {f.verdict === "reject" && show && (
                    <motion.div
                      className="absolute inset-0 bg-[rgb(var(--scrim)/0.62)] backdrop-grayscale"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: phase === "done" && reduce ? 0 : at, duration: 0.35 }}
                    />
                  )}
                  {f.verdict === "reject" && show && (
                    <motion.div
                      className="absolute bottom-1.5 left-1.5"
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: at + 0.1, duration: 0.35 }}
                    >
                      <Chip tone="reject" className="h-5 px-1.5 text-[9px] sm:h-6 sm:text-[10px]">
                        {f.reason}
                      </Chip>
                    </motion.div>
                  )}
                  {f.verdict === "pick" && show && (
                    <motion.div
                      className="absolute top-1.5 left-1.5"
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: at + 0.1, duration: 0.35 }}
                    >
                      <Chip tone="pick" className="h-5 px-1.5 text-[9px] sm:h-6 sm:text-[10px]">
                        Pick
                      </Chip>
                    </motion.div>
                  )}
                </div>
                {f.verdict === "pick" && show && (
                  <motion.span
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: at, duration: 0.3 }}
                  >
                    <Viewfinder inset={-4} size={12} />
                  </motion.span>
                )}
                <p className="mt-1.5 type-label text-[10px] text-ink-muted">{frameNo(f.n)}</p>
              </li>
            )
          })}
        </ol>

        {/* Scan line */}
        {phase === "scan" && !reduce && (
          <motion.div
            key={`scan-${run}`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            initial={{ y: -96 }}
            animate={{ y: sheetH - 96 }}
            transition={{ delay: START, duration: SCAN, ease: "linear" }}
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgb(242 169 59 / 0.10) 70%, rgb(242 169 59 / 0.9) 98%, transparent)",
            }}
          />
        )}
      </div>
    </div>
  )
}
