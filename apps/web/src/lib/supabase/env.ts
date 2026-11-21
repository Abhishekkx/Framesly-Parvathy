/**
 * Public Supabase settings (safe in the browser). The service-role key is
 * never read anywhere in the web app.
 *
 * Accepts either the legacy anon key or the newer publishable key name.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const STUDIO_ASSETS_BUCKET = "studio-assets"

/**
 * Show "Continue with Google" only once the Google provider is switched on in
 * Supabase. Set NEXT_PUBLIC_AUTH_GOOGLE=true then (see SETUP.md).
 */
export const isGoogleAuthEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE === "true"

/** Public URL of a file in the studio-assets bucket (logos, avatars). */
export function studioAssetUrl(path: string | null | undefined) {
  if (!path || !supabaseUrl) return null
  return `${supabaseUrl}/storage/v1/object/public/${STUDIO_ASSETS_BUCKET}/${path}`
}
