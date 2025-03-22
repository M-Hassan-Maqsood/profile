import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EducationForm } from "../../components/education-form"

export default async function AddEducationPage() {
  const user = await requireAuth()

  // Check if profile exists
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    redirect("/profile/create")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Add Education</h1>
      <EducationForm action="create" />
    </div>
  )
}

