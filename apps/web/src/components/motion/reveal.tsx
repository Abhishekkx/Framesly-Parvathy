"use client"

import { animate, motion, useReducedMotion } from "motion/react"
import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from "react"

import { cn } from "@/lib/utils"

const develop = [0.22, 1, 0.36, 1] as const

type RevealState = "static" | "armed" | "shown"

/**
 * Progressive reveal. The server HTML is always the finished, visible state,
 * so search engines, link previews and no-JS visitors see real content.
 *
 * After hydration, an element that starts below the fold is quietly "armed"
 * (hidden while off screen) and animates in when it scrolls into view.
 * Anything already on screen, and everything under reduced motion, simply
 * stays put.
 */
function useReveal(ref: RefObject<HTMLElement | null>, margin = "0px 0px -10% 0px"): RevealState {
  const reduce = useReducedMotion()
  const [state, setState] = useState<RevealState>("static")

  useEffect(() => {
    const el = ref.current
    if (reduce || !el) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    const raf = requestAnimationFrame(() => setState((s) => (s === "static" ? "armed" : s)))
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown")
          io.disconnect()
        }
      },
      { rootMargin: margin }
    )
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [reduce, ref, margin])

  return state
}

/** Fades and lifts a block into view the first time it scrolls in. */
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
  const ref = useRef<HTMLElement>(null)
  const state = useReveal(ref)
  const Comp = motion[as]
  return (
    <Comp
      ref={ref as never}
      className={className}
      initial={false}
      animate={state === "armed" ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={state === "armed" ? { duration: 0 } : { duration: 0.7, ease: develop, delay }}
    >
      {children}
    </Comp>
  )
}

/**
 * Headline that rises word by word when it scrolls in. The text is a normal,
 * fully visible heading in the server HTML; only headings that start off
 * screen animate, and they finish quickly so nothing reads half-faded.
 */
export function RevealText({
  text,
  className,
  as = "h2",
  delay = 0,
  immediate = false,
  id,
}: {
  text: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p"
  delay?: number
  /** Above-the-fold headline: never hidden, never animated. */
  immediate?: boolean
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const state = useReveal(ref)
  const Comp = as
  const words = text.split(" ")
  const hidden = !immediate && state === "armed"
  return (
    <Comp ref={ref as never} id={id} className={className}>
      {words.map((word, i) => (
        // The space sits outside the inline-block: trailing spaces inside one are dropped.
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={false}
              animate={hidden ? { y: "100%" } : { y: "0%" }}
              transition={hidden ? { duration: 0 } : { duration: 0.6, ease: develop, delay: delay + i * 0.035 }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Comp>
  )
}

/**
 * Number that counts up when it scrolls in. The server renders the final
 * value (never "0"); only a counter that starts off screen resets to `from`
 * before counting, so the reset is never seen.
 */
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
  const state = useReveal(ref, "0px 0px -15% 0px")
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (state !== "shown") return
    const controls = animate(from, to, { duration, ease: develop, onUpdate: setValue })
    return () => controls.stop()
  }, [state, from, to, duration])

  const shown = state === "armed" ? from : value
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(shown)}
    </span>
  )
}
