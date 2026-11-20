"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { cn } from "@/lib/utils"

const sparks = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2)

/**
 * Favourite toggle. Pressing it "develops" the heart: it pops, fills with
 * safelight and throws six sparks outward.
 */
export function HeartButton({
  on,
  onToggle,
  label,
  className,
  size = "md",
}: {
  on: boolean
  onToggle: () => void
  label: string
  className?: string
  size?: "md" | "lg"
}) {
  const [burst, setBurst] = useState(0)
  return (
    <motion.button
      type="button"
      aria-pressed={on}
      aria-label={label}
      whileTap={{ scale: 0.86 }}
      onClick={(e) => {
        e.stopPropagation()
        if (!on) setBurst((b) => b + 1)
        onToggle()
      }}
      className={cn(
        "relative grid place-items-center rounded-full transition-colors",
        size === "md" ? "size-11" : "size-12",
        className
      )}
    >
      <AnimatePresence>
        {burst > 0 && on && (
          <motion.span key={burst} className="pointer-events-none absolute inset-0" aria-hidden>
            {sparks.map((a, i) => (
              <motion.span
                key={i}
                className="absolute top-1/2 left-1/2 size-1 rounded-full bg-safelight"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 20, y: Math.sin(a) * 20, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.svg
        key={on ? "on" : "off"}
        viewBox="0 0 24 24"
        className={size === "md" ? "size-5" : "size-6"}
        initial={on ? { scale: 0.6 } : false}
        animate={{ scale: [0.6, 1.25, 1] }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <path
          d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8.2 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.6 0 5.6 3.7 4.4 6.9-1.7 4.5-9.2 9.1-9.2 9.1Z"
          fill={on ? "var(--safelight)" : "none"}
          stroke={on ? "var(--safelight)" : "currentColor"}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.button>
  )
}
