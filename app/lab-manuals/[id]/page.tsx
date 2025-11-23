"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { PDFViewer } from "@/components/pdf-viewer"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"

const manualMetadata: Record<
  string,
  { title: string; description: string; pdf: string }
> = {
  "system-modeling": {
    title: "System Modeling and Analysis - Second-Order RC Circuit",
    description:
      "Comprehensive lab manual for modeling and analyzing second-order RC circuits using Simulink and STM32 microcontroller.",
      pdf: "/lab-manuals/system-modeling.pdf",
  },

  "dc-motor-modeling": {
    title: "First and Second Order Modeling of DC Motor",
    description:
      "Lab manual for transient performance analysis of DC motor speed control circuits and transfer function identification.",
      pdf: "/lab-manuals/dc-motor-modeling.pdf",
  },

  "stability-analysis": {
    title: "Stability Analysis of Closed-Loop DC Motor",
    description:
      "Lab manual for evaluating closed-loop DC motor performance using Gain and Phase Margin analysis.",
      pdf: "/lab-manuals/stability-analysis.pdf",
  },
}

export default function LabManualPage() {
  const params = useParams()
  const manualId = params.id as string
  const metadata = manualMetadata[manualId]
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPdfUrl() {
      try {
        // First try the API endpoint (for Supabase storage)
        const response = await fetch(`/api/pdf-viewer?file=${manualId}.pdf`)
        if (response.ok) {
          const data = await response.json()
          setPdfUrl(data.url)
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.log("[v0] API fetch failed, using direct path")
      }

      // Fallback: Use direct PDF URL from public folder
      // PDFs should be in public/lab-manuals/ folder
      const directUrl = `/lab-manuals/${manualId}.pdf`
      setPdfUrl(directUrl)
      setIsLoading(false)
    }

    fetchPdfUrl()
  }, [manualId])

  if (!metadata) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Lab manual not found</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl lg:text-4xl mb-2">{metadata.title}</h1>
          <p className="text-lg text-muted-foreground">{metadata.description}</p>
        </div>

        {isLoading ? (
          <Card className="p-12 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Loading PDF...</span>
            </div>
          </Card>
        ) : pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} title={metadata.title} manualId={manualId} />
        ) : (
          <Card className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || "Failed to load PDF"}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
