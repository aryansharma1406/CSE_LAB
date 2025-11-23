import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("lab_manuals").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return Response.json({ manuals: data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error fetching lab manuals:", error)
    return Response.json({ error: "Failed to fetch lab manuals" }, { status: 500 })
  }
}
