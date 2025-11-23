'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { UserCheck } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MakeProfessorButton({ userId, email }: { userId: string; email: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const makeProfessor = async () => {
    if (!confirm(`Make ${email} a professor?`)) return

    setLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'professor' })
        .eq('id', userId)

      if (error) throw error

      alert(`${email} is now a professor!`)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to update role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={makeProfessor}
      disabled={loading}
      className="gap-2 border-green-200 hover:bg-green-50 hover:text-green-700"
    >
      <UserCheck className="h-4 w-4" />
      {loading ? 'Processing...' : 'Make Professor'}
    </Button>
  )
}