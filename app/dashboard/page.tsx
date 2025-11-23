import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Zap, Users, TrendingUp, UserCheck, FileText } from "lucide-react"
import Link from "next/link"
import SignOutButton from "@/components/sign-out-button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is professor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'professor' && profile.role !== 'admin')) {
    await supabase.auth.signOut()
    redirect("/auth/login?error=access_denied")
  }

  // Get user's progress and circuits
  const { data: progress } = await supabase.from("experiment_progress").select("*").eq("user_id", user.id)
  const { data: circuits } = await supabase.from("circuits").select("*").eq("user_id", user.id).limit(5)

  const completedExperiments = progress?.filter((p) => p.is_completed).length || 0
  const totalCircuits = circuits?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome back, {user.email}!</h1>
            <p className="text-gray-600">Continue your electrical engineering journey</p>
          </div>

          {/* BUTTONS SECTION */}
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" className="gap-2 border-green-200 hover:bg-green-50">
                <UserCheck className="h-4 w-4" />
                Admin Panel
              </Button>
            </Link>

            {/* INSERTED MANAGE PDFs BUTTON */}
            <Link href="/admin/pdfs">
              <Button className="gap-2">
                <FileText className="h-5 w-5" />
                Manage PDFs
              </Button>
            </Link>

            <SignOutButton />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Experiments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedExperiments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Circuits</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalCircuits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">7 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">#42</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Circuits</CardTitle>
              <CardDescription>Your latest circuit designs</CardDescription>
            </CardHeader>
            <CardContent>
              {circuits && circuits.length > 0 ? (
                <div className="space-y-3">
                  {circuits.map((circuit) => (
                    <div key={circuit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{circuit.name}</p>
                        <p className="text-sm text-gray-600">{circuit.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No circuits saved yet. Start building!</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/experiments">
                <Button className="w-full justify-start">
                  <Zap className="mr-2 h-4 w-4" />
                  Browse Experiments
                </Button>
              </Link>
              <Link href="/experiments/circuit-builder">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Circuit Builder
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
