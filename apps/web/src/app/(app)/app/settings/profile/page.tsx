import type { Metadata } from "next"

import { NewPasswordForm } from "@/components/auth/password-forms"
import { AvatarPicker } from "@/components/profile/avatar-picker"
import { ProfileForm } from "@/components/profile/profile-form"
import { signOutAction } from "@/features/auth/actions"
import { getProfile, requireStudio } from "@/lib/auth/dal"
import { studioAssetUrl } from "@/lib/supabase/env"

export const metadata: Metadata = { title: "Profile" }

/** The photographer's own account: name, email, password, sign out. */
export default async function ProfilePage() {
  const [{ user, role, studio }, profile] = await Promise.all([requireStudio(), getProfile()])
  const fullName = profile?.full_name || user.fullName
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="type-heading-1 md:type-display-l">Profile</h1>
      <p className="mt-3 text-ink-muted">
        {role === "owner" ? "Owner" : role === "editor" ? "Editor" : "Shooter"} at {studio.name}
      </p>

      <section aria-labelledby="details-title" className="mt-10 rounded-[var(--radius-cover)] border border-line bg-surface-raised p-5 sm:p-8">
        <h2 id="details-title" className="type-heading-2">Your details</h2>
        <div className="mt-6">
          <AvatarPicker userId={user.id} name={fullName} avatarUrl={studioAssetUrl(profile?.avatar_path ?? null)} />
        </div>
        <div className="mt-8">
          <ProfileForm fullName={fullName} email={user.email} />
        </div>
      </section>

      <section aria-labelledby="password-title" className="mt-6 rounded-[var(--radius-cover)] border border-line bg-surface-raised p-5 sm:p-8">
        <h2 id="password-title" className="type-heading-2">Password</h2>
        <p className="mt-1 type-caption font-normal text-ink-muted">Signed in with Google? Setting a password lets you log in with email too.</p>
        <div className="mt-6">
          <NewPasswordForm compact />
        </div>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-cover)] border border-line p-5 sm:p-8">
        <div>
          <h2 className="type-heading-2">Log out</h2>
          <p className="mt-1 type-caption font-normal text-ink-muted">Ends your session on this device.</p>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="h-11 rounded-[var(--radius-control)] border border-line-strong px-5 type-caption text-ink hover:border-ink">
            Log out
          </button>
        </form>
      </section>
    </div>
  )
}
