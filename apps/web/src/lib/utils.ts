export { cn } from "cn"

/** Format a frame number the way it is printed on a contact sheet: 0412. */
export function frameNo(n: number) {
  return String(n).padStart(4, "0")
}
