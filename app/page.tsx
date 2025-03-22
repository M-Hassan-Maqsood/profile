import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const user = await getCurrentUser()

  // If user is logged in, redirect to profile
  if (user) {
    redirect("/profile")
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Student Profile Management System
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mx-auto">
          Create and manage your student profile. Showcase your education, experience, skills, and projects.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/api/auth/login" className={buttonVariants({ size: "lg" })}>
          Get Started
        </Link>
        <Link href="/api/auth/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Sign In
        </Link>
      </div>
    </div>
  )
}

