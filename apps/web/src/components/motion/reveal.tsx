"use client"

import { motion, useInView, useReducedMotion, animate } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

const develop = [0.22, 1, 0.36, 1] as const

/** Fades and lifts children into view once, as they scroll in. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: "div" | "li" | "section" | "span"
}) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: develop, delay }}
    >
      {children}
    </Comp>
  )
}

/**
 * Headline reveal: each word rises out of a mask, like a print surfacing in
 * the developer tray. Screen readers get the plain sentence.
 */
export function RevealText({
  text,
  className,
  as = "h2",
  delay = 0,
  immediate = false,
}: {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p"
  delay?: number
  /** Animate on mount instead of on scroll (above-the-fold headlines). */
  immediate?: boolean
}) {
  const Comp = motion[as]
  const words = text.split(" ")
  const visible = { y: "0%", opacity: 1 }
  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: "105%", opacity: 0 }, show: visible }}
            transition={{ duration: 0.9, ease: develop }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Comp>
  )
}

/** Counts up to `to` the first time it scrolls into view. Tabular figures. */
export function Counter({
  to,
  from = 0,
  duration = 1.6,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  className,
}: {
  to: number
  from?: number
  duration?: number
  format?: (n: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(from, to, {
      duration,
      ease: develop,
      onUpdate: setValue,
    })
    return () => controls.stop()
  }, [inView, reduce, from, to, duration])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(reduce ? to : value)}
    </span>
  )
}
