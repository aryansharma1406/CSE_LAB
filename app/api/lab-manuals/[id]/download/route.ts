import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const manualId = params.id

    // Try to get the PDF from Supabase storage
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.storage
        .from("lab-manuals")
        .createSignedUrl(`pdfs/${manualId}.pdf`, 3600) // 1 hour expiry

      if (!error && data?.signedUrl) {
        // Redirect to the signed URL
        return NextResponse.redirect(data.signedUrl)
      }
    } catch (storageError) {
      console.log("[v0] Supabase storage not available, trying fallback:", storageError)
    }

    // Fallback: Try to serve from public folder
    // This allows PDFs to be served even without Supabase configured
    const publicPdfUrl = `/lab-manuals/${manualId}.pdf`
    const fullUrl = new URL(publicPdfUrl, request.url)
    
    // Return a redirect to the public PDF
    return NextResponse.redirect(fullUrl)
  } catch (error) {
    console.error("[v0] Error downloading lab manual:", error)
    // Return a more helpful error message
    return NextResponse.json(
      { 
        error: "Failed to download lab manual. The PDF file may not be available. Please contact support.",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
