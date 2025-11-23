import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const fileName = request.nextUrl.searchParams.get("file")
    if (!fileName) {
      return NextResponse.json({ error: "File name required" }, { status: 400 })
    }

    // Extract manual ID from filename (e.g., "system-modeling.pdf" -> "system-modeling")
    const manualId = fileName.replace(".pdf", "")

    const supabase = await createClient()
    const pdfId = request.nextUrl.searchParams.get("id") // Optional: PDF ID from database

    // If PDF ID is provided, get file path from database
    if (pdfId) {
      try {
        const { data: pdf, error: dbError } = await supabase
          .from('experiment_pdfs')
          .select('file_path')
          .eq('id', pdfId)
          .single()

        if (!dbError && pdf?.file_path) {
          // Get public URL from experiment-pdfs bucket
          const { data: { publicUrl } } = supabase.storage
            .from('experiment-pdfs')
            .getPublicUrl(pdf.file_path)
          
          return NextResponse.json({ url: publicUrl })
        }
      } catch (err) {
        console.error("Error fetching PDF from database:", err)
      }
    }

    // Try to get signed URL from Supabase storage (lab-manuals bucket)
    try {
      const { data, error } = await supabase.storage
        .from("lab-manuals")
        .createSignedUrl(`pdfs/${fileName}`, 3600) // 1 hour expiry

      if (!error && data?.signedUrl) {
        return NextResponse.json({ url: data.signedUrl })
      }
    } catch (supabaseError) {
      console.log("[v0] Supabase not available, trying experiment-pdfs bucket")
    }

    // Also try experiment-pdfs bucket
    try {
      const { data: { publicUrl } } = supabase.storage
        .from('experiment-pdfs')
        .getPublicUrl(fileName)
      
      if (publicUrl) {
        return NextResponse.json({ url: publicUrl })
      }
    } catch (err) {
      console.log("[v0] Could not get URL from experiment-pdfs bucket")
    }

    // Fallback: Return a public URL (PDFs should be in public/lab-manuals/ folder)
    // This allows the app to work even without Supabase configured
    const baseUrl = request.nextUrl.origin
    const fallbackUrl = `${baseUrl}/lab-manuals/${manualId}.pdf`
    
    return NextResponse.json({ url: fallbackUrl })
  } catch (error) {
    console.error("[v0] PDF API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
