"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteEducation } from "../actions"

type Education = {
  id: string
  institution: string
  degree: string
  field: string | null
  startDate: Date
  endDate: Date | null
  description: string | null
}

interface EducationItemProps {
  education: Education
}

export function EducationItem({ education }: EducationItemProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteEducation(education.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete education:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{education.institution}</h3>
          <p className="text-gray-700">
            {education.degree} {education.field && `in ${education.field}`}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(education.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })} -{" "}
            {education.endDate
              ? new Date(education.endDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Present"}
          </p>
          {education.description && <p className="mt-2 text-sm text-gray-600">{education.description}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-6 py-4 border-t">
        <Link href={`/profile/education/edit/${education.id}`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete this education entry.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

