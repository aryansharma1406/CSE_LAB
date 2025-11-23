import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Please check your .env.local file.")
    // Return response without Supabase initialization for non-protected routes
    if (!request.nextUrl.pathname.startsWith("/dashboard") && !request.nextUrl.pathname.startsWith("/profile")) {
      return supabaseResponse
    }
    // For protected routes, we still need Supabase, so throw error
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client! Check your Supabase project's API settings to find these values: https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  // Validate URL format
  if (supabaseUrl === "your-project-url-here" || !supabaseUrl.startsWith("http")) {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}". Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file to a valid Supabase project URL (e.g., https://your-project.supabase.co). Get your URL from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Optional: Redirect unauthenticated users from protected routes
  if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/profile"))) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
