"use client"

import { AnimatePresence, motion } from "motion/react"
import { useId, useState } from "react"

import { cn } from "@/lib/utils"

export type Faq = { q: string; a: string }

export const landingFaqs: Faq[] = [
  {
    q: "Do I upload again to deliver?",
    a: "No. Culling, the client gallery and downloads all read the same stored file. You upload once.",
  },
  {
    q: "Can I overrule the AI?",
    a: "Always. Every pick and reject shows its reason, and one keystroke or swipe flips it. Your decision wins.",
  },
  {
    q: "Do my clients see Framesly branding?",
    a: "Your logo and colours lead the gallery. The only mention of us is a small line in the footer.",
  },
  {
    q: "Which files can I upload?",
    a: "JPEGs and previews during the beta. RAW support arrives with the desktop uploader after launch.",
  },
  {
    q: "Where are my photos stored?",
    a: "In object storage with versioning and backups, in a region close to you. Nothing is deleted when you change a selection.",
  },
  {
    q: "How long can clients download?",
    a: "You choose an expiry per gallery. Large downloads are prepared in the background and the link is emailed.",
  },
]

const develop = [0.22, 1, 0.36, 1] as const

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <ul className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i
        const panelId = `${base}-panel-${i}`
        return (
          <li key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center gap-5 py-5 text-left"
              >
                <span className="type-metric w-6 text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("flex-1 type-heading-2 transition-colors", isOpen ? "text-ink" : "text-ink group-hover:text-safelight-text")}>
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-11 shrink-0 place-items-center rounded-[var(--radius-control)] border transition-colors duration-300",
                    isOpen ? "border-safelight bg-safelight text-on-safelight" : "border-line text-ink group-hover:border-line-strong"
                  )}
                >
                  <span className="absolute h-0.5 w-3.5 bg-current" />
                  <span className={cn("absolute h-3.5 w-0.5 bg-current transition-[scale] duration-300", isOpen && "scale-y-0")} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: develop }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pl-11 type-body-l text-ink-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
