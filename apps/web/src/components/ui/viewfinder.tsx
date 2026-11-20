import { cn } from "@/lib/utils"

/**
 * Viewfinder corner brackets: Framesly's selection mark.
 *
 * Used instead of glows or rounded outlines to say "this frame is chosen" or
 * "this card is in focus". Place inside a `relative` parent.
 *
 * - `state="on"`: brackets visible (an AI pick, a selected card).
 * - `state="hover"`: brackets appear when the closest `.group` is hovered or
 *   focused.
 */
export function Viewfinder({
  state = "on",
  inset = 0,
  size = 14,
  className,
}: {
  state?: "on" | "hover" | "off"
  inset?: number
  size?: number
  className?: string
}) {
  const corner =
    "absolute border-safelight transition-[opacity,scale] duration-300 ease-[var(--ease-develop)]"
  const vis =
    state === "on"
      ? "opacity-100 scale-100"
      : state === "hover"
        ? "opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100"
        : "opacity-0 scale-125"
  const s = { width: size, height: size }
  return (
    <span aria-hidden className={cn("pointer-events-none absolute", className)} style={{ inset }}>
      <span className={cn(corner, vis, "top-0 left-0 origin-top-left border-t-2 border-l-2")} style={s} />
      <span className={cn(corner, vis, "top-0 right-0 origin-top-right border-t-2 border-r-2")} style={s} />
      <span className={cn(corner, vis, "bottom-0 left-0 origin-bottom-left border-b-2 border-l-2")} style={s} />
      <span className={cn(corner, vis, "right-0 bottom-0 origin-bottom-right border-r-2 border-b-2")} style={s} />
    </span>
  )
}
