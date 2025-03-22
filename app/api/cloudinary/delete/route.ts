import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { requireAuth } from "@/lib/auth"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated
    await requireAuth()

    const { publicId } = await request.json()

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}

