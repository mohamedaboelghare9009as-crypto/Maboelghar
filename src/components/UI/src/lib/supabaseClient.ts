import { createClient } from '@supabase/supabase-js'

// Always use environment variables for secrets
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL =https://faicnecedxaifdqsgkhu.supabase.co
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaWNuZWNlZHhhaWZkcXNna2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTQxNzQsImV4cCI6MjA3NDYzMDE3NH0.d9maQiR47XPRscsuECss6TSfVR-MU6rv1wZZ5o83npk

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)")
}

export const supabase = createClient(supabaseUrl, supabaseKey)