import { createClient } from "./server"

export async function requireAdmin() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { authorized: false, error: 'Not authenticated' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Allow both admin and professor roles
  if (profile?.role !== 'admin' && profile?.role !== 'professor') {
    return { authorized: false, error: 'Not authorized' }
  }

  return { authorized: true, user, profile }
}

export async function getContactSubmissions(status?: string, limit = 50, offset = 0) {
  const supabase = await createClient()
  
  const { authorized } = await requireAdmin()
  if (!authorized) {
    throw new Error('Unauthorized')
  }

  let query = supabase
    .from('contact_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1)

  if (error) throw error
  return { data, count }
}

export async function updateSubmissionStatus(id: string, status: string, notes?: string) {
  const supabase = await createClient()
  
  const { authorized } = await requireAdmin()
  if (!authorized) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('contact_submissions')
    .update({
      status,
      response_notes: notes,
      responded_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient()
  
  const { authorized } = await requireAdmin()
  if (!authorized) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) throw error
}