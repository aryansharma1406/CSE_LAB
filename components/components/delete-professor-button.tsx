'use client'

import { deleteProfessor } from '@/app/actions/professors'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeleteProfessorButtonProps {
  professorId: string
  professorEmail: string
}

export default function DeleteProfessorButton({ 
  professorId, 
  professorEmail 
}: DeleteProfessorButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${professorEmail}?\n\nThis action cannot be undone. They will need to sign up again to access the platform.`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const result = await deleteProfessor(professorId)

      if (result.error) {
        toast.error(`Failed to delete: ${result.error}`)
      } else {
        toast.success(`${professorEmail} has been deleted successfully`)
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
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}