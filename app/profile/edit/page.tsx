import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "../components/profile-form"

export default async function EditProfilePage() {
  const user = await requireAuth()

  // Find existing profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      skills: true,
    },
  })

  // If no profile exists, redirect to create profile
  if (!profile) {
    redirect("/profile/create")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>
      <ProfileForm
        initialData={{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          profileImage: profile.profileImage || "",
          profession: profile.profession || "",
          batch: profile.batch || "",
          about: profile.about || "",
          phone: profile.phone || "",
          linkedin: profile.linkedin || "",
          skills: profile.skills.map((skill) => skill.name),
        }}
        action="update"
      />
    </div>
  )
}

