"use client"

import type { ImageLoaderProps } from "next/image"

/**
 * Global next/image loader. Images are resized by the CDN that already holds
 * them instead of Vercel's optimiser, which bills per image and would get
 * expensive with thousands of wedding photos per gallery.
 *
 * - Unsplash demo photos: Unsplash's own CDN parameters.
 * - Production photos (R2 + Cloudflare): add the Cloudflare Image Resizing
 *   branch here once the CDN hostname is known.
 * - Local files in /public: served as-is.
 */
export default function frameslyImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src)
    url.searchParams.set("w", String(width))
    url.searchParams.set("q", String(quality ?? 72))
    url.searchParams.set("auto", "format")
    url.searchParams.set("fit", "max")
    return url.toString()
  }
  return src
}
