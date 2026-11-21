"use client"

import { createClient } from "@/lib/supabase/client"
import { STUDIO_ASSETS_BUCKET } from "@/lib/supabase/env"

export const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"]
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

/** Check a profile photo before upload. Returns an error message or null. */
export function validateAvatar(file: File): string | null {
  if (!AVATAR_TYPES.includes(file.type)) return "Use a JPG, PNG or WebP photo."
  if (file.size > AVATAR_MAX_BYTES) return "Use a photo under 2 MB."
  return null
}

/**
 * Upload straight from the browser to Supabase Storage under
 * users/{userId}/avatar/. Storage RLS only lets a user write their own folder.
 * Returns the stored path.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }[file.type] ?? "jpg"
  const path = `users/${userId}/avatar/avatar-${Date.now()}.${ext}`
  const { error } = await createClient()
    .storage.from(STUDIO_ASSETS_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false })
  if (error) throw new Error(error.message)
  return path
}
