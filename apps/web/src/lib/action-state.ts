/** Shape returned by every form server action (used with React's useActionState). */
export type ActionState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Record<string, string>
  /** Echo of submitted values so a failed form keeps what the user typed. */
  values?: Record<string, string>
}

export const idle: ActionState = { status: "idle" }

export function formValues(formData: FormData, keys: string[]) {
  const out: Record<string, string> = {}
  for (const k of keys) {
    const v = formData.get(k)
    if (typeof v === "string") out[k] = v
  }
  return out
}
