import { getSession } from "@auth0/nextjs-auth0"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  // Find or create user in database
  const user = await prisma.user.upsert({
    where: {
      auth0Id: session.user.sub,
    },
    update: {
      name: session.user.name,
      email: session.user.email,
    },
    create: {
      auth0Id: session.user.sub,
      name: session.user.name,
      email: session.user.email,
    },
  })

  return {
    ...user,
    ...session.user,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  return user
}

