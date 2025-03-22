"use server"

import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createProfile(formData: FormData) {
  const user = await requireAuth()

  // Extract basic profile information
  const name = formData.get("name") as string
  const profession = formData.get("profession") as string
  const batch = formData.get("batch") as string
  const about = formData.get("about") as string
  const profileImage = formData.get("profileImage") as string

  // Extract contact information
  const phone = formData.get("phone") as string
  const linkedin = formData.get("linkedin") as string

  // Create the profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      name,
      profession,
      batch,
      about,
      profileImage,
      phone,
      email: user.email,
      linkedin,
    },
  })

  // Handle skills (we'll get these as a comma-separated string)
  const skillsString = formData.get("skills") as string
  if (skillsString) {
    const skills = skillsString.split(",").map((skill) => skill.trim())

    // Create all skills
    for (const skillName of skills) {
      if (skillName) {
        await prisma.skill.create({
          data: {
            profileId: profile.id,
            name: skillName,
          },
        })
      }
    }
  }

  revalidatePath("/profile")
  return profile
}

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()

  // Find existing profile
  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!existingProfile) {
    throw new Error("Profile not found")
  }

  // Extract basic profile information
  const name = formData.get("name") as string
  const profession = formData.get("profession") as string
  const batch = formData.get("batch") as string
  const about = formData.get("about") as string
  const profileImage = formData.get("profileImage") as string

  // Extract contact information
  const phone = formData.get("phone") as string
  const linkedin = formData.get("linkedin") as string

  // Update the profile
  const profile = await prisma.profile.update({
    where: {
      id: existingProfile.id,
    },
    data: {
      name,
      profession,
      batch,
      about,
      profileImage,
      phone,
      linkedin,
    },
  })

  // Handle skills - first delete existing skills
  await prisma.skill.deleteMany({
    where: {
      profileId: profile.id,
    },
  })

  // Then add new skills
  const skillsString = formData.get("skills") as string
  if (skillsString) {
    const skills = skillsString.split(",").map((skill) => skill.trim())

    // Create all skills
    for (const skillName of skills) {
      if (skillName) {
        await prisma.skill.create({
          data: {
            profileId: profile.id,
            name: skillName,
          },
        })
      }
    }
  }

  revalidatePath("/profile")
  return profile
}

export async function deleteProfile(userId: string) {
  const user = await requireAuth()

  // Ensure the user is deleting their own profile
  if (user.id !== userId) {
    throw new Error("Not authorized to delete this profile")
  }

  // Delete the profile
  await prisma.profile.delete({
    where: {
      userId: user.id,
    },
  })

  revalidatePath("/profile")
}

export async function addEducation(formData: FormData) {
  const user = await requireAuth()

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    throw new Error("Profile not found")
  }

  // Extract education data
  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const field = formData.get("field") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = (formData.get("endDate") as string) || null
  const description = formData.get("description") as string

  // Create education entry
  await prisma.education.create({
    data: {
      profileId: profile.id,
      institution,
      degree,
      field,
      startDate: new Date(startDateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      description,
    },
  })

  revalidatePath("/profile")
}

export async function updateEducation(formData: FormData) {
  const user = await requireAuth()
  const educationId = formData.get("educationId") as string

  // Find profile to ensure ownership
  const userProfile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!userProfile) {
    throw new Error("Profile not found")
  }

  // Find education to update
  const education = await prisma.education.findUnique({
    where: {
      id: educationId,
    },
  })

  if (!education || education.profileId !== userProfile.id) {
    throw new Error("Education not found or not authorized")
  }

  // Extract education data
  const institution = formData.get("institution") as string
  const degree = formData.get("degree") as string
  const field = formData.get("field") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = (formData.get("endDate") as string) || null
  const description = formData.get("description") as string

  // Update education entry
  await prisma.education.update({
    where: {
      id: educationId,
    },
    data: {
      institution,
      degree,
      field,
      startDate: new Date(startDateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      description,
    },
  })

  revalidatePath("/profile")
}

export async function deleteEducation(educationId: string) {
  const user = await requireAuth()

  // Find profile to ensure ownership
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    throw new Error("Profile not found")
  }

  // Find education to delete
  const education = await prisma.education.findUnique({
    where: {
      id: educationId,
    },
  })

  if (!education || education.profileId !== profile.id) {
    throw new Error("Education not found or not authorized")
  }

  // Delete education entry
  await prisma.education.delete({
    where: {
      id: educationId,
    },
  })

  revalidatePath("/profile")
}

export async function addExperience(formData: FormData) {
  const user = await requireAuth()

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    throw new Error("Profile not found")
  }

  // Extract experience data
  const company = formData.get("company") as string
  const position = formData.get("position") as string
  const location = formData.get("location") as string
  const startDateStr = formData.get("startDate") as string
  const endDateStr = (formData.get("endDate") as string) || null
  const description = formData.get("description") as string

  // Create experience entry
  await prisma.experience.create({
    data: {
      profileId: profile.id,
      company,
      position,
      location,
      startDate: new Date(startDateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      description,
    },
  })

  revalidatePath("/profile")
}

export async function addProject(formData: FormData) {
  const user = await requireAuth()

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!profile) {
    throw new Error("Profile not found")
  }

  // Extract project data
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const githubLink = formData.get("githubLink") as string
  const liveLink = formData.get("liveLink") as string
  const imageUrls = formData.get("imageUrls") as string

  // Create project entry
  const project = await prisma.project.create({
    data: {
      profileId: profile.id,
      name,
      description,
      githubLink,
      liveLink,
    },
  })

  // Add project images
  if (imageUrls) {
    const urls = imageUrls.split(",").map((url) => url.trim())

    for (const url of urls) {
      if (url) {
        await prisma.projectImage.create({
          data: {
            projectId: project.id,
            url,
          },
        })
      }
    }
  }

  revalidatePath("/profile")
}

