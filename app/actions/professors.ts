'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProfessor(professorId: string) {
  const supabase = await createClient()
  
  // Verify the current user is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  // Delete from profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', professorId)

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/admin/professors')
  return { success: true }
}