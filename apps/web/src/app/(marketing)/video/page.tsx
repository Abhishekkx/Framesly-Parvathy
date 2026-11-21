import type { Metadata } from "next"

import { VideoTeaser } from "@/components/landing/video-teaser"
import { RevealText } from "@/components/motion/reveal"
import { ButtonLink } from "@/components/ui/button"
import { Card, EdgeLabel } from "@/components/ui/card"
import { pageMeta } from "@/lib/site"

export const metadata: Metadata = {
  ...pageMeta("/video"),
  title: "Video",
  description: "Wedding films next to the photos in one client gallery. Coming after the beta.",
}

const planned = [
  { n: "01", title: "Three cuts, one gallery", body: "Teaser, highlight and full film sit in the same gallery as the photos." },
  { n: "02", title: "Comments on the second", body: "Clients leave notes pinned to a timestamp instead of long emails." },
  { n: "03", title: "Streams anywhere", body: "Adaptive playback that starts fast on a phone in a hotel lobby." },
]

export default function VideoPage() {
  return (
    <>
      <section className="grain relative overflow-hidden pt-32 pb-16 md:pt-40">
        <div className="gutter mx-auto max-w-[var(--container-content)]">
          <EdgeLabel>Coming after the beta</EdgeLabel>
          <RevealText as="h1" immediate text="For the people holding the other camera." className="mt-4 max-w-4xl type-display-l text-balance md:type-display-xl" />
          <p className="mt-6 max-w-xl type-body-l text-ink-muted">
            Videographers deliver from the same gallery as the photographer. We are building it next.
          </p>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {planned.map((p) => (
              <li key={p.n}>
                <Card className="h-full p-6">
                  <p className="type-metric text-safelight-text">{p.n}</p>
                  <h2 className="mt-8 type-heading-2">{p.title}</h2>
                  <p className="mt-2 text-ink-muted">{p.body}</p>
                </Card>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/signup" variant="secondary">Start with photos today</ButtonLink>
          </div>
        </div>
      </section>
      <VideoTeaser showLink={false} />
    </>
  )
}
