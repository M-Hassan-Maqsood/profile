"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProfile, updateProfile } from "../actions"
import { uploadImage } from "@/lib/cloudinary"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
  initialData?: {
    id?: string
    name?: string
    email?: string
    profileImage?: string
    profession?: string
    batch?: string
    about?: string
    phone?: string
    linkedin?: string
    skills?: string[]
  }
  action: "create" | "update"
}

export function ProfileForm({ initialData = {}, action }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState(initialData.profileImage || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])

      // Preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Upload image if selected
      if (imageFile) {
        setIsUploading(true)
        const uploadResult = await uploadImage(imageFile)
        formData.set("profileImage", uploadResult.secure_url)
        setIsUploading(false)
      } else if (profileImage) {
        formData.set("profileImage", profileImage)
      }

      // Submit form data
      if (action === "create") {
        await createProfile(formData)
      } else {
        await updateProfile(formData)
      }

      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <p className="text-sm text-gray-500">Provide your personal details for your student profile.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={initialData.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" defaultValue={initialData.email} disabled />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {profileImage && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession/Title</Label>
                  <Input
                    id="profession"
                    name="profession"
                    placeholder="e.g. Computer Science Student"
                    defaultValue={initialData.profession}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch/Year</Label>
                  <Input id="batch" name="batch" placeholder="e.g. 2023 or Batch 45" defaultValue={initialData.batch} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  placeholder="Tell us about yourself..."
                  defaultValue={initialData.about}
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <p className="text-sm text-gray-500">How can others reach you?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="e.g. +1234567890" defaultValue={initialData.phone} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    placeholder="e.g. https://linkedin.com/in/yourusername"
                    defaultValue={initialData.linkedin}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Skills</h2>
              <p className="text-sm text-gray-500">List your skills (comma separated)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="e.g. JavaScript, React, Node.js, UI/UX Design"
                defaultValue={initialData.skills?.join(", ")}
              />
              <p className="text-xs text-gray-500">Separate skills with commas</p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Uploading Image..." : isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

