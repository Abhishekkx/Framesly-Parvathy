"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"

import { Aperture } from "@/components/auth/primitives"
import { setAvatarAction } from "@/features/profile/actions"
import { uploadAvatar, validateAvatar } from "@/features/profile/upload-avatar"

/** Profile photo: a round portrait with initials until one is chosen. */
export function AvatarPicker({ userId, name, avatarUrl }: { userId: string; name: string; avatarUrl: string | null }) {
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(avatarUrl)
  const [error, setError] = useState<string | null>(null)
  const [busy, start] = useTransition()
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"

  const choose = (file: File | undefined) => {
    if (!file) return
    const err = validateAvatar(file)
    setError(err)
    if (err) return
    start(async () => {
      try {
        const path = await uploadAvatar(userId, file)
        const r = await setAvatarAction(path)
        if (!r.ok) throw new Error(r.message)
        setUrl(URL.createObjectURL(file))
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed. Try again.")
      }
    })
  }

  const remove = () =>
    start(async () => {
      const r = await setAvatarAction(null)
      if (r.ok) {
        setUrl(null)
        router.refresh()
      } else setError(r.message ?? "Couldn't remove the photo.")
    })

  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-safelight-soft font-heading text-[24px] font-bold text-ink">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-uploaded photo from Supabase Storage
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          <span aria-hidden>{initials}</span>
        )}
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-surface/70">
            <Aperture className="size-5" />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="h-11 rounded-[var(--radius-control)] border border-line-strong px-4 type-caption text-ink hover:border-ink disabled:opacity-50"
          >
            {url ? "Change photo" : "Upload photo"}
          </button>
          {url && (
            <button type="button" disabled={busy} onClick={remove} className="h-11 rounded-[var(--radius-control)] px-4 type-caption text-ink-muted hover:text-danger disabled:opacity-50">
              Remove
            </button>
          )}
        </div>
        <p className="mt-2 type-caption font-normal text-ink-muted">JPG, PNG or WebP, up to 2 MB.</p>
        {error && <p className="mt-1 type-caption text-danger" role="alert">{error}</p>}
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label="Profile photo"
          onChange={(e) => {
            choose(e.target.files?.[0])
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
