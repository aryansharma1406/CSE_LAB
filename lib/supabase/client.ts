import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
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

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
