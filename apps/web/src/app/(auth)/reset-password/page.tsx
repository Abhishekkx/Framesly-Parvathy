import type { Metadata } from "next"
import { Suspense } from "react"

import { NewPasswordForm } from "@/components/auth/password-forms"
import { requireUser } from "@/lib/auth/dal"

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } }

/** Reached from the reset email; the link signs the user in for this step. */
export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-[420px]">
      <h1 className="type-heading-1 md:type-display-l">Choose a new password</h1>
      <p className="mt-3 text-ink-muted">You’ll stay signed in on this device.</p>
      <div className="mt-8">
        <Suspense>
          <ResetGate />
        </Suspense>
      </div>
    </div>
  )
}

async function ResetGate() {
  await requireUser("/reset-password")
  return <NewPasswordForm />
}
