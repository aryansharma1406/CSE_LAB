"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2 } from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  title: string
  manualId: string
}

export function PDFViewer({ pdfUrl, title, manualId }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // For local PDFs (starting with /), create a direct download link
      if (pdfUrl && pdfUrl.startsWith("/")) {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setIsLoading(false)
        return
      }
      
      // For external URLs (http/https), fetch and download
      if (pdfUrl && pdfUrl.startsWith("http")) {
        try {
          const response = await fetch(pdfUrl, { mode: "cors" })
          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            setIsLoading(false)
            return
          }
        } catch (fetchError) {
          console.log("[v0] Direct fetch failed, trying API endpoint")
        }
      }
      
      // Fallback: Use the download API endpoint
      const downloadUrl = `/api/lab-manuals/${manualId}/download`
      window.open(downloadUrl, "_blank")
      
    } catch (err) {
      setError("Failed to download PDF. Please try right-clicking the PDF above and selecting 'Save As', or use the 'Open PDF in New Tab' button below.")
      console.error("[v0] PDF download error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-heading">{title}</CardTitle>
        <Button onClick={handleDownload} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">{error}</div>
        )}

        {/* PDF Viewer using iframe */}
        <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            title={title}
            className="w-full"
            style={{ height: "800px" }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load PDF viewer")
              setIsLoading(false)
            }}
          />
        </div>

        {/* Alternative: External viewer link */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 mb-2">If the PDF doesn't display properly:</p>
          <Button asChild variant="outline" size="sm" className="text-blue-600 bg-transparent">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              Open PDF in New Tab
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
