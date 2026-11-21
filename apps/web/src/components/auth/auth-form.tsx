"use client"

import { AnimatePresence, motion, useAnimate, type Variants } from "motion/react"
import { useState } from "react"

import { AuthBanner } from "@/components/auth/auth-showcase"
import { RevealText } from "@/components/motion/reveal"
import { TransitionLink as Link } from "@/components/transition/page-transition"
import { Button, ButtonArrow } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { toSlug, validateStudioSlug } from "@/lib/reserved-slugs"

const develop = [0.22, 1, 0.36, 1] as const

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: develop } },
}

/** Aperture spinner: six blades rotating, shown while the link is "sent". */
function Aperture() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="size-5"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M12 3.5 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 12 12)`} />
      ))}
    </motion.svg>
  )
}

/** A check mark that draws itself inside a ring. */
function DrawnCheck() {
  return (
    <svg viewBox="0 0 64 64" className="size-16 text-success" aria-hidden>
      <motion.circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        initial={{ pathLength: 0, rotate: -90 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: develop }}
        style={{ originX: "50%", originY: "50%" }}
      />
      <motion.path
        d="M20 33.5 28.5 42 45 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: develop, delay: 0.55 }}
      />
    </svg>
  )
}

/**
 * Login and signup. UI only for now.
 * TODO: wire to Supabase Auth (email link and Google) once backend settings are confirmed.
 *
 * Motion: the form rises in block by block, the submit button shows an
 * aperture while "sending", invalid input shakes the form, and the success
 * state draws its own check mark.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login"
  const [email, setEmail] = useState("")
  const [studio, setStudio] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [touched, setTouched] = useState(false)
  const [formRef, animateForm] = useAnimate<HTMLFormElement>()
  const slug = toSlug(studio)
  const slugError = !isLogin && (studio || touched) ? validateStudioSlug(slug) : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!isLogin && validateStudioSlug(slug)) {
      animateForm(formRef.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.45 })
      return
    }
    setStatus("sending")
    setTimeout(() => setStatus("sent"), 1100)
  }

  return (
    <div className="w-full max-w-[420px]">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: develop }}
          >
            <DrawnCheck />
            <p className="mt-6 type-label text-success">Email sent</p>
            <h1 className="mt-3 type-heading-1 md:type-display-l">Check your inbox</h1>
            <p className="mt-3 type-body-l text-ink-muted">
              We sent a sign-in link to <span className="text-ink">{email}</span>. It works for 15 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setStatus("idle")}>
                Use a different email
              </Button>
              {/* Until Supabase Auth is wired up (FR-03), this previews where a signed-in photographer lands. */}
              <Link href="/app" className="type-caption font-semibold text-safelight-text underline-offset-4 hover:underline">
                Preview the dashboard
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}>
            <motion.div variants={item} className="mb-8 lg:hidden">
              <AuthBanner />
            </motion.div>

            <motion.p variants={item} className="type-label text-safelight-text">
              {isLogin ? "Log in" : "Start free · no card needed"}
            </motion.p>
            <RevealText
              as="h1"
              immediate
              delay={0.2}
              text={isLogin ? "Welcome back." : "Open your studio."}
              className="mt-3 type-heading-1 md:type-display-l"
            />
            <motion.p variants={item} className="mt-3 text-ink-muted">
              {isLogin
                ? "Your galleries are where you left them."
                : "Create your studio and deliver your first wedding this week."}
            </motion.p>

            <motion.div variants={item}>
              <Button variant="secondary" className="mt-8 w-full">
                <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
                  <path fill="currentColor" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.83h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.34Z" />
                  <path fill="currentColor" opacity=".75" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.24-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.07v2.58A10 10 0 0 0 12 22Z" />
                  <path fill="currentColor" opacity=".55" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.52H3.07a10 10 0 0 0 0 8.96L6.4 13.9Z" />
                  <path fill="currentColor" opacity=".85" d="M12 5.98c1.47 0 2.8.5 3.84 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.52L6.4 10.1C7.19 7.74 9.4 5.98 12 5.98Z" />
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            <motion.div variants={item} className="my-6 flex items-center gap-4" aria-hidden>
              <motion.span className="h-px flex-1 origin-right bg-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.7, ease: develop }} />
              <span className="type-label text-ink-muted">or with email</span>
              <motion.span className="h-px flex-1 origin-left bg-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.7, ease: develop }} />
            </motion.div>

            <form ref={formRef} className="space-y-5" onSubmit={submit} noValidate={!isLogin}>
              {!isLogin && (
                <motion.div variants={item}>
                  <Field
                    label="Studio name"
                    name="studio"
                    placeholder="Saffron Lane…"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    required
                    autoComplete="organization"
                    error={slugError}
                    hint={
                      <>
                        Galleries live at{" "}
                        <motion.span key={slug || "empty"} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="type-metric text-[13px] text-ink">
                          framesly.app/{slug || "your-studio"}
                        </motion.span>
                      </>
                    }
                  />
                </motion.div>
              )}
              <motion.div variants={item}>
                <Field
                  label="Email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  name="email"
                  spellCheck={false}
                  placeholder="you@studio.com…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div variants={item}>
                <Button type="submit" size="lg" className="w-full" disabled={status === "sending"} aria-busy={status === "sending"}>
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "sending" ? (
                      <motion.span key="sending" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <Aperture />
                        Sending your link…
                      </motion.span>
                    ) : (
                      <motion.span key="idle" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        {isLogin ? "Email me a sign-in link" : "Create my studio"}
                        <ButtonArrow />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </form>

            <motion.p variants={item} className="mt-8 type-caption font-normal text-ink-muted">
              {isLogin ? "New to Framesly? " : "Already have a studio? "}
              <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-safelight-text underline-offset-4 hover:underline">
                {isLogin ? "Start free" : "Log in"}
              </Link>
            </motion.p>
            {!isLogin && (
              <motion.p variants={item} className="mt-3 type-caption font-normal text-ink-muted">
                By continuing you agree to the{" "}
                <Link href="/legal/terms" className="underline underline-offset-4">terms</Link> and{" "}
                <Link href="/legal/privacy" className="underline underline-offset-4">privacy policy</Link>.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
