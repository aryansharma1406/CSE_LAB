import { redirect } from 'next/navigation'
import { requireAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MakeProfessorButton from "@/components/make-professor-button"
import DeleteProfessorButton from "@/components/delete-professor-button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ManageProfessorsPage() {
  const { authorized } = await requireAdmin()

  if (!authorized) {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id
  
  // Get all users - with error handling
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // Debug: Log the data
  console.log('Total profiles found:', profiles?.length)
  console.log('Error:', error)
  console.log('Current user ID:', currentUserId)

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
            <h1 className="text-3xl font-bold text-green-800">Manage Professors</h1>
            <p className="text-gray-600">View and manage all users</p>
          </div>
        </div>

        {/* Debug Info - Remove this later */}
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p className="font-bold">Debug Info:</p>
          <p>Total users found: {profiles?.length || 0}</p>
          <p>Current user ID: {currentUserId}</p>
          {error && <p className="text-red-600">Error: {error.message}</p>}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({profiles?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles && profiles.length > 0 ? (
                    profiles.map((profile: any) => (
                      <tr key={profile.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{profile.email}</td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              profile.role === 'professor' || profile.role === 'admin'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {profile.role || 'student'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {profile.role !== 'professor' && profile.role !== 'admin' ? (
                              <MakeProfessorButton userId={profile.id} email={profile.email} />
                            ) : (
                              <span className="text-sm text-gray-500">Already a professor</span>
                            )}
                            
                            {/* Show delete button for everyone except the current logged-in user */}
                            {profile.id !== currentUserId && (
                              <DeleteProfessorButton 
                                professorId={profile.id} 
                                professorEmail={profile.email}
                              />
                            )}
                            
                            {/* Show message if it's the current user */}
                            {profile.id === currentUserId && (
                              <span className="text-sm text-gray-500 italic">(You - Current User)</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}