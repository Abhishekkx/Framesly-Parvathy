import { getMembership } from "@/lib/auth/dal"
import { studioAssetUrl } from "@/lib/supabase/env"

/** Whole days left on the free trial (0 once it has ended). */
function trialDaysLeft(endsAt: string, now = Date.now()) {
  return Math.max(0, Math.ceil((new Date(endsAt).getTime() - now) / 86_400_000))
}

/** Studio name, logo and trial status in the app header. */
export async function StudioBadge() {
  const membership = await getMembership()
  if (!membership) return <StudioBadgeSkeleton />
  const { studio } = membership
  const logo = studioAssetUrl(studio.logo_path)
  const daysLeft = trialDaysLeft(studio.trial_ends_at)
  const initials = studio.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line font-heading text-[13px] font-bold"
        style={{ background: logo ? "var(--surface-raised)" : studio.brand_color, color: "#16191f" }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- small Storage-hosted logo, any format incl. SVG
          <img src={logo} alt="" className="max-h-7 max-w-7 object-contain" />
        ) : (
          initials
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate type-caption text-ink">{studio.name}</p>
        <p className="truncate type-caption font-normal text-ink-muted">
          {studio.plan === "trial" ? (daysLeft > 0 ? `Free trial · ${daysLeft} days left` : "Trial ended") : studio.plan}
        </p>
      </div>
    </div>
  )
}

export function StudioBadgeSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3" aria-hidden>
      <span className="size-9 rounded-full bg-surface-raised" />
      <span className="space-y-1.5">
        <span className="block h-3 w-28 rounded bg-surface-raised" />
        <span className="block h-3 w-20 rounded bg-surface-raised" />
      </span>
    </div>
  )
}
