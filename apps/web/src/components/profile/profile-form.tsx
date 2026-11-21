"use client"

import { useActionState } from "react"

import { FormAlert, SubmitButton } from "@/components/auth/primitives"
import { Field } from "@/components/ui/field"
import { updateProfileAction } from "@/features/profile/actions"
import { idle } from "@/lib/action-state"

/** The photographer's own details. */
export function ProfileForm({ fullName, email }: { fullName: string; email: string }) {
  const [state, action] = useActionState(updateProfileAction, idle)
  return (
    <form action={action} className="space-y-6" noValidate>
      {state.status === "success" && <FormAlert tone="success">{state.message}</FormAlert>}
      {state.status === "error" && state.message && <FormAlert>{state.message}</FormAlert>}
      <Field label="Your name" name="fullName" autoComplete="name" defaultValue={state.values?.fullName ?? fullName} error={state.fieldErrors?.fullName} />
      <Field label="Email" type="email" value={email} readOnly hint="This is the email you log in with." />
      <SubmitButton pendingLabel="Saving…" arrow={false} className="sm:w-auto">
        Save profile
      </SubmitButton>
    </form>
  )
}
