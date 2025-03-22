import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { EducationItem } from "../components/education-item"

export default async function EducationPage() {
  const user = await requireAuth()

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      education: {
        orderBy: {
          startDate: "desc",
        },
      },
    },
  })

  if (!profile) {
    redirect("/profile/create")
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Education</h1>
        <Link href="/profile/education/add" className={buttonVariants({ size: "sm" })}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Education
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Education History</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.education.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No education details added yet.</p>
              <Link href="/profile/education/add" className={buttonVariants()}>
                Add Your First Education Entry
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {profile.education.map((education) => (
                <EducationItem key={education.id} education={education} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

