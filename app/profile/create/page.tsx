import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "../components/profile-form"

export default async function CreateProfilePage() {
  const user = await requireAuth()

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  // If profile exists, redirect to edit page
  if (existingProfile) {
    redirect("/profile/edit")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create Your Profile</h1>
      <ProfileForm
        initialData={{
          name: user.name || "",
          email: user.email,
        }}
        action="create"
      />
    </div>
  )
}

