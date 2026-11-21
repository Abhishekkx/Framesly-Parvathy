import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "./database.types"
import { supabaseAnonKey, supabaseUrl } from "./env"

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

/** Supabase client for Client Components (one shared instance per tab). */
export function createClient() {
  browserClient ??= createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  return browserClient
}
