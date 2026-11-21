import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import { safeNext } from "@/lib/auth/redirects"
import { createClient } from "@/lib/supabase/server"

/**
 * Where confirmation and password-reset emails land. Handles both link styles:
 * - ?token_hash=&type=  from our branded templates (supabase/templates/*.html,
 *   active once custom SMTP is set). Works in any browser or device.
 * - ?code=              from Supabase's default templates (PKCE). Works in the
 *   browser the person signed up in.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeNext(searchParams.get("next"))
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")

  const supabase = await createClient()
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    // Opened in a different browser from the one used to sign up: Supabase has
    // already confirmed the email, but this browser can't finish the sign-in.
    if (error.code === "pkce_code_verifier_not_found") return NextResponse.redirect(`${origin}/login?confirmed=1`)
  }
  return NextResponse.redirect(`${origin}/login?error=link`)
}
