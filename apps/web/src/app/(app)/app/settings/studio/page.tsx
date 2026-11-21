import type { Metadata } from "next"

import { AppPlaceholder } from "@/components/app/app-placeholder"

export const metadata: Metadata = { title: "Studio settings" }

export default function StudioSettingsPage() {
  return (
    <AppPlaceholder
      eyebrow="FR-04"
      title="Studio settings"
      body="Your studio name, gallery address, logo and brand colour. Clients see these on every gallery."
    />
  )
}
