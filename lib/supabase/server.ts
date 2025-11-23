import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createServerClient_server = createServerClient

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
    )
  }

  // Validate URL format
  if (supabaseUrl === "your-project-url-here" || !supabaseUrl.startsWith("http")) {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}". Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file to a valid Supabase project URL (e.g., https://your-project.supabase.co). Get your URL from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file."
    )
  }

  // Validate URL format
  if (supabaseUrl === "your-project-url-here" || !supabaseUrl.startsWith("http")) {
    throw new Error(
      `Invalid Supabase URL: "${supabaseUrl}". Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file to a valid Supabase project URL (e.g., https://your-project.supabase.co). Get your URL from: https://supabase.com/dashboard/project/_/settings/api`
    )
  }

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}

export default createClient
