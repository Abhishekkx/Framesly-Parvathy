import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DeleteGallery, GalleryDetails, SectionsManager } from "@/components/app/gallery-editor"
import { requireStudio } from "@/lib/auth/dal"
import { getGalleryWithSections } from "@/lib/data/galleries"

export const metadata: Metadata = { title: "Gallery" }

/** One gallery: details, sections, uploads (FR-09 groundwork). */
export default async function GalleryPage({ params, searchParams }: PageProps<"/app/galleries/[galleryId]">) {
  const [{ galleryId }, query, { studio }] = await Promise.all([params, searchParams, requireStudio()])
  const data = await getGalleryWithSections(galleryId)
  if (!data || data.gallery.studio_id !== studio.id) notFound()
  const { gallery, sections } = data

  return (
    <div className="mx-auto max-w-[var(--container-content)]">
      <Link href="/app" className="inline-flex h-11 items-center gap-2 type-caption text-ink-muted hover:text-ink">
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden><path d="M12 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        All galleries
      </Link>
      {query.created === "1" && (
        <p role="status" className="mt-2 mb-4 rounded-[var(--radius-control)] border border-safelight/40 bg-safelight-soft px-4 py-3 text-ink">
          Gallery created. Next, upload the wedding.
        </p>
      )}

      <div className="mt-2">
        <GalleryDetails id={gallery.id} title={gallery.title} eventDate={gallery.event_date} status={gallery.status} />
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: "Photos", value: gallery.photo_count },
          { label: "Ready", value: gallery.ready_count },
          { label: "Failed", value: gallery.failed_count },
        ].map((m) => (
          <div key={m.label} className="rounded-[var(--radius-control)] border border-line bg-surface-raised p-4">
            <dt className="type-caption font-normal text-ink-muted">{m.label}</dt>
            <dd className="mt-1 type-metric text-[22px] leading-8 text-ink">{m.value.toLocaleString("en")}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="upload-title" className="flex min-h-72 flex-col items-center justify-center rounded-[var(--radius-cover)] border border-dashed border-line-strong p-8 text-center">
          <svg viewBox="0 0 24 24" className="size-10 text-ink-muted" aria-hidden>
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2.5h16V17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 id="upload-title" className="mt-4 type-heading-2">Upload the wedding</h2>
          <p className="mt-2 max-w-sm type-caption font-normal text-ink-muted">
            Drag in whole folders from every card. Uploads resume after a dropped connection. This arrives with the upload pipeline (FR-05, FR-06).
          </p>
        </section>
        <div className="space-y-6">
          <SectionsManager galleryId={gallery.id} sections={sections} />
          <DeleteGallery id={gallery.id} title={gallery.title} />
        </div>
      </div>
    </div>
  )
}
