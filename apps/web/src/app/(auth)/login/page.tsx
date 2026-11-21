import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/components/auth/login-form"
import { pageMeta } from "@/lib/site"

export const metadata: Metadata = {
  ...pageMeta("/login"),
  title: "Log in",
}

export default function LoginPage() {
  // The form reads ?next= and ?error=, so it renders inside a Suspense boundary.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
