import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseBrowserClient(url, key)
}

export function createBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("createBrowserClient can only be used in browser environment")
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseBrowserClient(url, key)
}
