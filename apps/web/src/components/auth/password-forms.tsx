"use client"

import { motion } from "motion/react"
import { useActionState, useState } from "react"

import { DrawnCheck, FormAlert, item, PasswordField, PasswordRules, stagger, SubmitButton } from "@/components/auth/primitives"
import { TransitionLink as Link } from "@/components/transition/page-transition"
import { Field } from "@/components/ui/field"
import { forgotPasswordAction, updatePasswordAction } from "@/features/auth/actions"
import { idle } from "@/lib/action-state"

/** Step 1: ask for the email and send a reset link. */
export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, idle)

  if (state.status === "success") {
    return (
      <motion.div className="w-full max-w-[420px]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <DrawnCheck />
        <h1 className="mt-6 type-heading-1 md:type-display-l">Check your inbox</h1>
        <p className="mt-3 type-body-l text-ink-muted">
          If an account exists for <span className="text-ink">{state.message}</span>, a reset link is on its way. It works for one hour.
        </p>
        <Link href="/login" className="mt-8 inline-block type-caption font-semibold text-safelight-text underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div className="w-full max-w-[420px]" variants={stagger} initial="hidden" animate="show">
      <motion.h1 variants={item} className="type-heading-1 md:type-display-l">Reset your password</motion.h1>
      <motion.p variants={item} className="mt-3 text-ink-muted">Enter your account email and we’ll send a link to choose a new password.</motion.p>
      <form action={action} className="mt-8 space-y-5" noValidate>
        {state.message && state.status === "error" && <FormAlert>{state.message}</FormAlert>}
        <motion.div variants={item}>
          <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} placeholder="you@studio.com…" required defaultValue={state.values?.email} error={state.fieldErrors?.email} />
        </motion.div>
        <motion.div variants={item}>
          <SubmitButton pendingLabel="Sending the link…">Send reset link</SubmitButton>
        </motion.div>
      </form>
      <motion.p variants={item} className="mt-8 type-caption font-normal text-ink-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-safelight-text underline-offset-4 hover:underline">Log in</Link>
      </motion.p>
    </motion.div>
  )
}

/**
 * Choose a new password. Used on /reset-password (after the email link) and
 * in profile settings (`compact`).
 */
export function NewPasswordForm({ compact = false }: { compact?: boolean }) {
  const [state, action] = useActionState(updatePasswordAction, idle)
  const [password, setPassword] = useState("")
  return (
    <form action={action} className="space-y-5" noValidate>
      {!compact && <input type="hidden" name="redirect" value="app" />}
      {state.status === "success" && <FormAlert tone="success">{state.message}</FormAlert>}
      <div>
        <PasswordField label="New password" name="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} error={state.fieldErrors?.password} />
        <PasswordRules value={password} />
      </div>
      <PasswordField label="Type it again" name="confirm" autoComplete="new-password" required error={state.fieldErrors?.confirm} />
      <SubmitButton pendingLabel="Saving…" arrow={!compact} className={compact ? "w-auto" : undefined}>
        {compact ? "Change password" : "Save new password"}
      </SubmitButton>
    </form>
  )
}
