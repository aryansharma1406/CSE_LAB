'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPDF(formData: FormData) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const difficultyLevel = formData.get('difficulty_level') as string

  if (!file || !title) {
    return { error: 'File and title are required' }
  }

  // Upload to storage
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('experiment-pdfs')
    .upload(fileName, file)

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('experiment-pdfs')
    .getPublicUrl(fileName)

  // Save to database
  const { error: dbError } = await supabase
    .from('experiment_pdfs')
    .insert({
      title,
      description,
      file_name: file.name,
      file_path: fileName,
      file_size: file.size,
      category,
      difficulty_level: difficultyLevel,
      uploaded_by: user.id,
    })

  if (dbError) {
    // Rollback: delete uploaded file
    await supabase.storage.from('experiment-pdfs').remove([fileName])
    return { error: dbError.message }
  }

  revalidatePath('/admin/pdfs')
  revalidatePath('/experiments')
  return { success: true, url: publicUrl }
}

export async function deletePDF(pdfId: string, filePath: string) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('experiment-pdfs')
    .remove([filePath])

  if (storageError) {
    return { error: storageError.message }
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('experiment_pdfs')
    .delete()
    .eq('id', pdfId)

  if (dbError) {
    return { error: dbError.message }
  }

  revalidatePath('/admin/pdfs')
  revalidatePath('/experiments')
  return { success: true }
}

export async function getAllPDFs() {
  const supabase = await createClient()
  
  const { data: pdfs, error } = await supabase
    .from('experiment_pdfs')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, pdfs: [] }
  }

  // Get public URLs for all PDFs
  const pdfsWithUrls = (pdfs || []).map((pdf: any) => {
    const { data: { publicUrl } } = supabase.storage
      .from('experiment-pdfs')
      .getPublicUrl(pdf.file_path)
    
    return {
      ...pdf,
      pdf_url: publicUrl
    }
  })

  return { pdfs: pdfsWithUrls }
}

export async function getPDFsForExperiments() {
  const supabase = await createClient()
  
  const { data: pdfs, error } = await supabase
    .from('experiment_pdfs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message, pdfs: [] }
  }

  // Get public URLs and format for experiments page
  const experiments = (pdfs || []).map((pdf: any) => {
    const { data: { publicUrl } } = supabase.storage
      .from('experiment-pdfs')
      .getPublicUrl(pdf.file_path)
    
    // Generate a slug from the title for the URL
    const slug = pdf.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    return {
      id: pdf.id.toString(),
      title: pdf.title,
      description: pdf.description || '',
      difficulty: pdf.difficulty_level || 'Beginner',
      duration: '120 min', // Default duration
      category: pdf.category || 'General',
      participants: 0, // Default participants
      image: '/virtual-circuit-board-with-electronic-components-a.jpg', // Default image
      hasLabManual: true,
      manualId: pdf.id.toString(), // Use PDF ID as manual ID
      pdf_url: publicUrl,
      file_path: pdf.file_path,
      created_at: pdf.created_at
    }
  })

  return { experiments }
}