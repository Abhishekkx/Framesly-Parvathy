import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "./database.types"
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env"

/**
 * Refreshes the Supabase session cookie on every matched request and returns
 * the response plus whether someone is signed in. Used by src/proxy.ts.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  if (!isSupabaseConfigured) return { response, signedIn: false }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        Object.entries(headers ?? {}).forEach(([key, value]) => response.headers.set(key, value))
      },
    },
  })

  // getClaims() verifies the JWT; don't run other logic between client creation and this call.
  const { data } = await supabase.auth.getClaims()
  return { response, signedIn: Boolean(data?.claims) }
}
