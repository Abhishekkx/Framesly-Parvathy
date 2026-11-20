import Image from "next/image"
import Link from "next/link"

import { Wordmark } from "@/components/site/wordmark"
import { Viewfinder } from "@/components/ui/viewfinder"
import { photos } from "@/lib/photos"

/** Split layout: form on the left, a framed photograph on the right (desktop). */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="grain flex flex-col px-4 py-6 sm:px-10 lg:px-16">
        <Link href="/" aria-label="Framesly home" className="self-start">
          <Wordmark />
        </Link>
        <main className="flex flex-1 items-center py-12">{children}</main>
        <p className="type-label text-ink-muted">© 2026 Framesly</p>
      </div>

      <div className="relative hidden bg-surface-sunken p-10 lg:block">
        <div className="relative h-full">
          <div className="absolute inset-6 overflow-hidden">
            <Image src={photos.riverRock.src} alt={photos.riverRock.alt} fill priority sizes="50vw" quality={85} className="object-cover object-[50%_40%]" />
          </div>
          <Viewfinder inset={0} size={28} />
          <div className="absolute right-10 bottom-10 left-10 flex items-end justify-between gap-6">
            <p className="max-w-xs font-heading text-[28px] leading-8 font-bold tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]">
              2,184 frames in. 612 delivered.
            </p>
            <span className="rounded-[var(--radius-chip)] bg-[rgb(11_13_16/0.7)] px-2 py-1 type-label text-[#e9ecf1]">Frame 0412 · Pick</span>
          </div>
        </div>
      </div>
    </div>
  )
}
