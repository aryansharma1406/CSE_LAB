import { redirect } from 'next/navigation'
import { requireAdmin } from "@/lib/supabase/admin"
import { getAllPDFs } from "@/app/actions/pdfs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Upload } from "lucide-react"
import UploadPDFForm from "@/components/upload-pdf-form"
import DeletePDFButton from "@/components/delete-pdf-button"

export default async function ManagePDFsPage() {
  const { authorized } = await requireAdmin()

  if (!authorized) {
    redirect("/dashboard")
  }

  const { pdfs } = await getAllPDFs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-green-800">Manage Experiment PDFs</h1>
            <p className="text-gray-600">Upload and manage experiment manuals</p>
          </div>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadPDFForm />
          </CardContent>
        </Card>

        {/* PDF List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Experiment PDFs ({pdfs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pdfs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No PDFs uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {pdfs.map((pdf: any) => (
                  <div
                    key={pdf.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pdf.title}</h3>
                      <p className="text-sm text-gray-600">{pdf.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {pdf.category}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {pdf.difficulty_level}
                        </span>
                        <span>{(pdf.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>{new Date(pdf.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <DeletePDFButton pdfId={pdf.id} filePath={pdf.file_path} title={pdf.title} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}