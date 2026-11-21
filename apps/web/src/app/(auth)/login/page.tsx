import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"
import { pageMeta } from "@/lib/site"

export const metadata: Metadata = {
  ...pageMeta("/login"),
  title: "Log in",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}
