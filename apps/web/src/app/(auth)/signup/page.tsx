import type { Metadata } from "next"
import { Suspense } from "react"

import { SignupForm } from "@/components/auth/signup-form"
import { pageMeta } from "@/lib/site"

export const metadata: Metadata = {
  ...pageMeta("/signup"),
  title: "Start free",
}

export default function SignupPage() {
  // Reads ?plan= from the pricing cards, so it renders inside a Suspense boundary.
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
