'use client'

import { uploadPDF } from '@/app/actions/pdfs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function UploadPDFForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [category, setCategory] = useState('Control Systems')
  const [difficulty, setDifficulty] = useState('Beginner')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('category', category)
    formData.set('difficulty_level', difficulty)
    
    try {
      const result = await uploadPDF(formData)

      if (result.error) {
        toast.error(`Upload failed: ${result.error}`)
      } else {
        toast.success('PDF uploaded successfully!')
        e.currentTarget.reset()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g., System Modeling and Analysis"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Control Systems">Control Systems</option>
            <option value="Circuit Analysis">Circuit Analysis</option>
            <option value="Digital Electronics">Digital Electronics</option>
            <option value="Power Systems">Power Systems</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <Label htmlFor="difficulty_level">Difficulty Level</Label>
          <select
            id="difficulty_level"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <Label htmlFor="file">PDF File *</Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept=".pdf"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the experiment..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isUploading} className="w-full">
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Upload PDF'}
      </Button>
    </form>
  )
}