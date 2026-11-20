"use client"

import { AnimatePresence, motion } from "motion/react"
import { createContext, useCallback, useContext, useRef, useState } from "react"

type Toast = { id: number; title: string; body?: string; tone?: "neutral" | "success" }

const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

/** Minimal toasts. Success states always carry a word, never colour alone. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const next = useRef(0)

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = ++next.current
    setToasts((all) => [...all.slice(-2), { ...t, id }])
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 3600)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 pb-[env(safe-area-inset-bottom)]"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="theme-darkroom pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-control)] border border-line-strong px-4 py-3 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]"
            >
              <span aria-hidden className={t.tone === "success" ? "mt-2 size-1.5 rounded-full bg-success" : "mt-2 size-1.5 rounded-full bg-safelight"} />
              <div>
                <p className="type-caption text-ink">{t.title}</p>
                {t.body && <p className="mt-0.5 type-caption font-normal text-ink-muted">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
