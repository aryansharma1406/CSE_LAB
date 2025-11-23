import { requireAdmin, updateSubmissionStatus, deleteSubmission } from "@/lib/supabase/admin"
import { NextResponse, type NextRequest } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, response_notes } = body

    await updateSubmissionStatus(params.id, status, response_notes)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { authorized } = await requireAdmin()
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteSubmission(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}
