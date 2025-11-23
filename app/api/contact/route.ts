import { createServiceRoleClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = createServiceRoleClient()

  const body = await request.json()
  const { name, email, subject, message } = body

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const { data: submission, error } = await supabase
    .from("contact_submissions")
    .insert({
      name,
      email,
      subject,
      message,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Contact submission error:", error.message, error.code)
    return NextResponse.json({ error: "Failed to submit contact form. Please try again." }, { status: 500 })
  }

  return NextResponse.json({
    message: "Contact form submitted successfully",
    submission,
  })
}
