import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { DeleteProfileButton } from "./delete-profile-button"

export default async function ProfilePage() {
  const user = await requireAuth()

  // Find profile for this user
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      education: true,
      experience: true,
      skills: true,
      projects: {
        include: {
          images: true,
        },
      },
    },
  })

  // If no profile exists, redirect to create profile
  if (!profile) {
    redirect("/profile/create")
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <div className="flex gap-2">
          <Link href="/profile/edit" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
          <DeleteProfileButton userId={user.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              {profile.profileImage ? (
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
                  <Image
                    src={profile.profileImage || "/placeholder.svg"}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-500">{profile.name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              {profile.profession && <p className="text-gray-500">{profile.profession}</p>}
              {profile.batch && <p className="text-sm text-gray-400">Batch: {profile.batch}</p>}

              {profile.about && (
                <div className="mt-4 text-left">
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm text-gray-600">{profile.about}</p>
                </div>
              )}

              <div className="mt-6 w-full">
                <h3 className="font-medium mb-2 text-left">Contact</h3>
                <div className="text-sm text-left">
                  <p className="mb-1">
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                  {profile.phone && (
                    <p className="mb-1">
                      <span className="font-medium">Phone:</span> {profile.phone}
                    </p>
                  )}
                  {profile.linkedin && (
                    <p className="mb-1">
                      <span className="font-medium">LinkedIn:</span>{" "}
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill.name} {skill.proficiency && `(${skill.proficiency})`}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.education.length === 0 ? (
                <p className="text-gray-500">No education details added yet.</p>
              ) : (
                <div className="space-y-4">
                  {profile.education.map((edu) => (
                    <div key={edu.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-bold">{edu.institution}</h3>
                      <p className="text-gray-600">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(edu.startDate).getFullYear()} -{" "}
                        {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                      </p>
                      {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.experience.length === 0 ? (
                <p className="text-gray-500">No experience details added yet.</p>
              ) : (
                <div className="space-y-4">
                  {profile.experience.map((exp) => (
                    <div key={exp.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                      <p className="text-sm text-gray-500">
                        {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -{" "}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                          : "Present"}
                      </p>
                      {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.projects.length === 0 ? (
                <p className="text-gray-500">No projects added yet.</p>
              ) : (
                <div className="space-y-8">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-bold text-xl mb-2">{project.name}</h3>

                      {project.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          {project.images.map((image) => (
                            <div key={image.id} className="relative aspect-video rounded-md overflow-hidden">
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`${project.name} screenshot`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {project.description && <p className="mb-3 text-sm">{project.description}</p>}

                      <div className="flex gap-4">
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            GitHub Repository
                          </a>
                        )}
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

