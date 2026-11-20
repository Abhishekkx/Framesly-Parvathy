"use client"

import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"

import { Button, ButtonArrow } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { toSlug, validateStudioSlug } from "@/lib/reserved-slugs"

const develop = [0.22, 1, 0.36, 1] as const

/**
 * Login and signup. UI only for now.
 * TODO: wire to Supabase Auth (email link and Google) once backend settings are confirmed.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login"
  const [email, setEmail] = useState("")
  const [studio, setStudio] = useState("")
  const [sent, setSent] = useState(false)
  const slug = toSlug(studio)
  const slugError = studio ? validateStudioSlug(slug) : null

  return (
    <div className="w-full max-w-[400px]">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: develop }}
          >
            <p className="type-label text-success">Email sent</p>
            <h1 className="mt-3 type-heading-1">Check your inbox</h1>
            <p className="mt-3 type-body-l text-ink-muted">
              We sent a sign-in link to <span className="text-ink">{email}</span>. It works for 15 minutes.
            </p>
            <Button variant="secondary" className="mt-8" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: develop }}
          >
            <h1 className="type-heading-1 md:type-display-l">{isLogin ? "Welcome back" : "Start free"}</h1>
            <p className="mt-3 text-ink-muted">
              {isLogin
                ? "Your galleries are where you left them."
                : "Create your studio and deliver your first wedding this week."}
            </p>

            <Button variant="secondary" className="mt-8 w-full">
              <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
                <path fill="currentColor" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.34Z" />
                <path fill="currentColor" opacity=".75" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
                <path fill="currentColor" opacity=".55" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96L6.4 13.9Z" />
                <path fill="currentColor" opacity=".85" d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" />
              </svg>
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-4" aria-hidden>
              <span className="h-px flex-1 bg-line" />
              <span className="type-label text-ink-muted">or with email</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (!isLogin && slugError) return
                setSent(true)
              }}
            >
              {!isLogin && (
                <Field
                  label="Studio name"
                  placeholder="Saffron Lane"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  required
                  autoComplete="organization"
                  error={slugError}
                  hint={
                    <>
                      Galleries live at <span className="type-metric text-[13px] text-ink">framesly.app/{slug || "your-studio"}</span>
                    </>
                  }
                />
              )}
              <Field
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full">
                {isLogin ? "Email me a sign-in link" : "Create my studio"}
                <ButtonArrow />
              </Button>
            </form>

            <p className="mt-8 type-caption font-normal text-ink-muted">
              {isLogin ? "New to Framesly? " : "Already have a studio? "}
              <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-safelight-text underline-offset-4 hover:underline">
                {isLogin ? "Start free" : "Log in"}
              </Link>
            </p>
            {!isLogin && (
              <p className="mt-3 type-caption font-normal text-ink-muted">
                By continuing you agree to the{" "}
                <Link href="/legal/terms" className="underline underline-offset-4">terms</Link> and{" "}
                <Link href="/legal/privacy" className="underline underline-offset-4">privacy policy</Link>.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
