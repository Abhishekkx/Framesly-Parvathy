import "server-only"

import { headers } from "next/headers"

/** Only same-site paths are allowed as ?next= targets (no open redirects). */
export function safeNext(next: unknown, fallback = "/app") {
  if (typeof next !== "string") return fallback
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback
  return next
}

/** Absolute origin for auth email and OAuth redirect links. */
export async function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL
  if (configured) return configured.replace(/\/$/, "")
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https")
  return `${proto}://${host}`
}
