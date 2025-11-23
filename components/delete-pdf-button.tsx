'use client'

import { deletePDF } from '@/app/actions/pdfs'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeletePDFButtonProps {
  pdfId: string
  filePath: string
  title: string
}

export default function DeletePDFButton({ pdfId, filePath, title }: DeletePDFButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const result = await deletePDF(pdfId, filePath)

      if (result.error) {
        toast.error(`Failed to delete: ${result.error}`)
      } else {
        toast.success('PDF deleted successfully!')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}