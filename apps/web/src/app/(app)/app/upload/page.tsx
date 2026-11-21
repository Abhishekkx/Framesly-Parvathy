import type { Metadata } from "next"

import { AppPlaceholder } from "@/components/app/app-placeholder"

export const metadata: Metadata = { title: "Uploads" }

export default function UploadsPage() {
  return (
    <AppPlaceholder
      eyebrow="FR-06"
      title="Uploads"
      body="Resumable uploads of whole weddings straight to storage, with progress, retry and resume after a dropped connection."
    />
  )
}
