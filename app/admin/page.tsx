import { redirect } from 'next/navigation'
import { requireAdmin, getContactSubmissions } from "@/lib/supabase/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AdminMessageModal from "@/components/admin-message-modal"
import AdminFilters from "@/components/admin-filters"
import { Mail, CheckCircle, AlertCircle, Trash2, LogOut, UserCheck } from 'lucide-react'
import SignOutButton from "@/components/sign-out-button"
import Link from "next/link"

export default async function AdminPage() {
  const { authorized, user } = await requireAdmin()

  if (!authorized) {
    redirect("/dashboard")
  }

  const { data: submissions } = await getContactSubmissions()

  const stats = {
    total: submissions?.length || 0,
    new: submissions?.filter((s: any) => s.status === 'new').length || 0,
    responded: submissions?.filter((s: any) => s.status === 'responded').length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Contact Submissions</h1>
            <p className="text-gray-600">Manage and respond to contact form submissions</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/professors">
              <Button variant="outline" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Manage Professors
              </Button>
            </Link>
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Messages</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.new}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Responded</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>View and manage all contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">From</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions && submissions.length > 0 ? (
                    submissions.map((submission: any) => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{submission.name}</p>
                            <p className="text-sm text-gray-600">{submission.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{submission.subject}</td>
                        <td className="py-3 px-4">
                          {submission.category && (
                            <Badge variant="outline">{submission.category}</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              submission.status === 'new'
                                ? 'bg-orange-100 text-orange-800'
                                : submission.status === 'responded'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <AdminMessageModal submission={submission} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No submissions found
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