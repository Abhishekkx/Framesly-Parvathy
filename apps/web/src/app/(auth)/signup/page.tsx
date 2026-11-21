import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"
import { pageMeta } from "@/lib/site"

export const metadata: Metadata = {
  ...pageMeta("/signup"),
  title: "Start free",
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
