"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { addEducation, updateEducation } from "../actions"
import { Loader2 } from "lucide-react"

interface EducationFormProps {
  initialData?: {
    id?: string
    institution?: string
    degree?: string
    field?: string
    startDate?: Date
    endDate?: Date | null
    description?: string
  }
  action: "create" | "update"
}

export function EducationForm({ initialData = {}, action }: EducationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatDateForInput = (date?: Date | null) => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0]
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      if (action === "update" && initialData.id) {
        formData.append("educationId", initialData.id)
        await updateEducation(formData)
      } else {
        await addEducation(formData)
      }

      router.push("/profile/education")
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  placeholder="e.g. Stanford University"
                  defaultValue={initialData.institution}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    name="degree"
                    placeholder="e.g. Bachelor of Science"
                    defaultValue={initialData.degree}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input id="field" name="field" placeholder="e.g. Computer Science" defaultValue={initialData.field} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={formatDateForInput(initialData.startDate)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (leave blank if current)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={formatDateForInput(initialData.endDate)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe your education..."
                  defaultValue={initialData.description}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile/education")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Saving..." : action === "create" ? "Add Education" : "Update Education"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

