"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

export default function TestCloudinaryPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setImageUrl(data.secure_url)
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please check your Cloudinary configuration.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container py-12 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Cloudinary Upload</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select an image to upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
        </div>

        {isUploading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Uploading to Cloudinary...</p>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {imageUrl && (
          <div className="space-y-4">
            <p className="text-sm font-medium">Uploaded Image:</p>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
            </div>
            <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  )
}

