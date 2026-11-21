"use client"

import { STUDIO_ASSETS_BUCKET } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/client"

export const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"]
export const LOGO_MAX_BYTES = 2 * 1024 * 1024

/** Check a logo file before upload. Returns an error message or null. */
export function validateLogo(file: File): string | null {
  if (!LOGO_TYPES.includes(file.type)) return "Use a PNG, JPG, WebP or SVG file."
  if (file.size > LOGO_MAX_BYTES) return "Use a file under 2 MB."
  return null
}

/**
 * Upload straight from the browser to Supabase Storage (RLS: members only)
 * under studios/{studioId}/logo/. Returns the stored path.
 */
export async function uploadLogo(studioId: string, file: File): Promise<string> {
  const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" }[file.type] ?? "png"
  const path = `studios/${studioId}/logo/logo-${Date.now()}.${ext}`
  const supabase = createClient()
  const { error } = await supabase.storage.from(STUDIO_ASSETS_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(error.message)
  return path
}
