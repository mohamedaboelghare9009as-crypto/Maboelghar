import { createClient } from '@supabase/supabase-js'

// Always use environment variables for secrets
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Did you set them in Vercel?")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
