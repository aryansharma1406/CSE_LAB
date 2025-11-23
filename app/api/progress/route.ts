import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const experimentId = url.searchParams.get("experiment_id")

  let query = supabase.from("experiment_progress").select("*").eq("user_id", user.id)

  if (experimentId) {
    query = query.eq("experiment_id", experimentId)
  }

  const { data: progress, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { experiment_id, completed_steps, is_completed } = body

  const { data: progress, error } = await supabase
    .from("experiment_progress")
    .upsert({
      user_id: user.id,
      experiment_id,
      completed_steps,
      is_completed,
      completion_time: is_completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ progress })
}
