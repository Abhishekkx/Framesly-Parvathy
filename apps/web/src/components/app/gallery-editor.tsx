"use client"

import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { Aperture } from "@/components/auth/primitives"
import { Dialog } from "@/components/app/new-gallery-dialog"
import { Button } from "@/components/ui/button"
import {
  addSectionAction,
  deleteGalleryAction,
  deleteSectionAction,
  moveSectionAction,
  renameSectionAction,
  updateGalleryAction,
} from "@/features/galleries/actions"
import type { GalleryStatus } from "@/lib/supabase/database.types"
import { cn } from "@/lib/utils"

type Section = { id: string; name: string; sort_order: number }

const statuses: { value: GalleryStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "culling", label: "Culling" },
  { value: "delivered", label: "Delivered" },
  { value: "archived", label: "Archived" },
]

/** Editable title, date and status. Saves on blur / change. */
export function GalleryDetails({ id, title, eventDate, status }: { id: string; title: string; eventDate: string | null; status: GalleryStatus }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const save = (input: Parameters<typeof updateGalleryAction>[1]) =>
    start(async () => {
      const r = await updateGalleryAction(id, input)
      if (!r.ok) setError(r.message ?? "Couldn't save.")
      else {
        setError(null)
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
        router.refresh()
      }
    })

  return (
    <div>
      <label className="sr-only" htmlFor="gallery-title">Gallery name</label>
      <input
        id="gallery-title"
        defaultValue={title}
        maxLength={120}
        onBlur={(e) => e.target.value.trim() !== title && save({ title: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        className="w-full rounded-[var(--radius-chip)] bg-transparent type-heading-1 text-ink outline-none hover:bg-surface-raised focus:bg-surface-raised md:type-display-l"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex h-11 items-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-3 type-caption text-ink">
          <span className="text-ink-muted">Date</span>
          <input type="date" defaultValue={eventDate ?? ""} onChange={(e) => save({ eventDate: e.target.value || null })} className="bg-transparent text-ink outline-none [color-scheme:inherit]" />
        </label>
        <label className="flex h-11 items-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-3 type-caption text-ink">
          <span className="text-ink-muted">Status</span>
          <select defaultValue={status} onChange={(e) => save({ status: e.target.value as GalleryStatus })} className="bg-surface-raised text-ink outline-none">
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <span className="type-caption font-normal text-ink-muted" aria-live="polite">
          {pending ? "Saving…" : saved ? "Saved" : ""}
        </span>
      </div>
      {error && <p className="mt-2 type-caption text-danger" role="alert">{error}</p>}
    </div>
  )
}

/** Sections (one per event): add, rename, reorder, delete. */
export function SectionsManager({ galleryId, sections }: { galleryId: string; sections: Section[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [editing, setEditing] = useState<string | null>(null)

  const run = (fn: () => Promise<{ ok: boolean; message?: string }>) =>
    start(async () => {
      const r = await fn()
      if (!r.ok) setError(r.message ?? "Something went wrong.")
      else {
        setError(null)
        router.refresh()
      }
    })

  return (
    <section aria-labelledby="sections-title" className="rounded-[var(--radius-cover)] border border-line bg-surface-raised p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="sections-title" className="type-heading-2">Sections</h2>
        {pending && <Aperture className="size-4 text-ink-muted" />}
      </div>
      <p className="mt-1 type-caption font-normal text-ink-muted">Clients see one section per event, in this order.</p>

      <ol className="mt-5 divide-y divide-line border-y border-line">
        <AnimatePresence initial={false}>
          {sections.map((s, i) => (
            <motion.li
              key={s.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex min-h-14 items-center gap-2 py-2"
            >
              <span className="w-6 shrink-0 type-metric text-[13px] text-ink-muted">{i + 1}</span>
              {editing === s.id ? (
                <form
                  className="flex flex-1 gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const name = String(new FormData(e.currentTarget).get("name") ?? "")
                    setEditing(null)
                    run(() => renameSectionAction(galleryId, s.id, name))
                  }}
                >
                  <label className="sr-only" htmlFor={`rename-${s.id}`}>Section name</label>
                  <input id={`rename-${s.id}`} name="name" defaultValue={s.name} autoFocus maxLength={60} className="h-11 min-w-0 flex-1 rounded-[var(--radius-chip)] border border-line-strong bg-surface-sunken px-3 text-ink outline-none focus:border-safelight-text" />
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="quiet" onClick={() => setEditing(null)}>Cancel</Button>
                </form>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-ink">{s.name}</span>
                  <IconBtn label={`Move ${s.name} up`} disabled={i === 0 || pending} onClick={() => run(() => moveSectionAction(galleryId, s.id, -1))} d="M10 15V5m0 0-4 4m4-4 4 4" />
                  <IconBtn label={`Move ${s.name} down`} disabled={i === sections.length - 1 || pending} onClick={() => run(() => moveSectionAction(galleryId, s.id, 1))} d="M10 5v10m0 0-4-4m4 4 4-4" />
                  <IconBtn label={`Rename ${s.name}`} disabled={pending} onClick={() => setEditing(s.id)} d="M4 16h3l8.5-8.5-3-3L4 13v3Z" />
                  <IconBtn label={`Delete ${s.name}`} danger disabled={pending} onClick={() => run(() => deleteSectionAction(galleryId, s.id))} d="M5 6h10M8 6V4.5h4V6m-6 0 .7 9.5h6.6L14 6" />
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
        {sections.length === 0 && <li className="py-4 type-caption font-normal text-ink-muted">No sections yet. Photos will show in one list until you add some.</li>}
      </ol>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const name = newName
          setNewName("")
          run(() => addSectionAction(galleryId, name))
        }}
      >
        <label className="sr-only" htmlFor="new-section">New section name</label>
        <input
          id="new-section"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a section, like Engagement…"
          maxLength={60}
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-[var(--radius-chip)] border border-line-strong bg-surface-sunken px-3 text-ink outline-none placeholder:text-ink-muted/70 focus:border-safelight-text"
        />
        <Button type="submit" variant="secondary" disabled={!newName.trim() || pending}>Add</Button>
      </form>
      {error && <p className="mt-3 type-caption text-danger" role="alert">{error}</p>}
    </section>
  )
}

function IconBtn({ label, d, onClick, disabled, danger }: { label: string; d: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn("grid size-11 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-sunken disabled:opacity-30", danger ? "hover:text-danger" : "hover:text-ink")}
    >
      <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/** Delete with a typed confirmation: deleting a gallery can't be undone. */
export function DeleteGallery({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  return (
    <section aria-labelledby="danger-title" className="rounded-[var(--radius-cover)] border border-danger/40 p-5 sm:p-6">
      <h2 id="danger-title" className="type-heading-2">Delete gallery</h2>
      <p className="mt-1 type-caption font-normal text-ink-muted">Removes the gallery, its sections and its photos for good.</p>
      <Button variant="danger" className="mt-4" onClick={() => setOpen(true)}>Delete gallery</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete this gallery?">
        <p className="text-ink-muted">
          This can’t be undone. Type <span className="font-semibold text-ink">{title}</span> to confirm.
        </p>
        <label className="sr-only" htmlFor="confirm-delete">Gallery name</label>
        <input id="confirm-delete" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" className="mt-4 h-11 w-full rounded-[var(--radius-chip)] border border-line-strong bg-surface-sunken px-3 text-ink outline-none focus:border-safelight-text" />
        {error && <p className="mt-2 type-caption text-danger" role="alert">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="danger"
            disabled={typed.trim() !== title.trim() || pending}
            onClick={() =>
              start(async () => {
                const r = await deleteGalleryAction(id)
                if (r && !r.ok) setError(r.message ?? "Couldn't delete.")
              })
            }
          >
            {pending ? "Deleting…" : "Delete gallery"}
          </Button>
        </div>
      </Dialog>
    </section>
  )
}
