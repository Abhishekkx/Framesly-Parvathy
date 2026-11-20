"use client"

import { animate } from "motion/react"

/** Height of the fixed header plus a little air, so sections don't land under it. */
const HEADER_OFFSET = 72

let running: { stop: () => void } | null = null

/**
 * Eased programmatic scroll. Native `scroll-behavior: smooth` varies by
 * browser and can't be tuned; this uses one curve everywhere, scales the
 * duration with distance, and hands control back the moment the visitor
 * scrolls or touches the page.
 */
export function smoothScrollTo(targetY: number) {
  running?.stop()
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const max = document.documentElement.scrollHeight - window.innerHeight
  const to = Math.max(0, Math.min(targetY, max))
  if (reduce) {
    window.scrollTo({ top: to, behavior: "instant" })
    return
  }

  const from = window.scrollY
  const distance = Math.abs(to - from)
  if (distance < 2) return

  const cancel = () => {
    running?.stop()
    cleanup()
  }
  const cleanup = () => {
    window.removeEventListener("wheel", cancel)
    window.removeEventListener("touchstart", cancel)
    window.removeEventListener("keydown", cancel)
  }
  window.addEventListener("wheel", cancel, { passive: true })
  window.addEventListener("touchstart", cancel, { passive: true })
  window.addEventListener("keydown", cancel)

  running = animate(from, to, {
    duration: Math.min(1.6, 0.55 + distance / 5000),
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
    onComplete: cleanup,
  })
}

/** Smoothly scroll to `#id`; returns false if the element isn't on this page. */
export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""))
  if (!id) {
    smoothScrollTo(0)
    return true
  }
  const el = document.getElementById(id)
  if (!el) return false
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET)
  return true
}
