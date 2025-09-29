// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.https://faicnecedxaifdqsgkhu.supabase.co!;
const supabaseAnonKey = process.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaWNuZWNlZHhhaWZkcXNna2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTQxNzQsImV4cCI6MjA3NDYzMDE3NH0.d9maQiR47XPRscsuECss6TSfVR-MU6rv1wZZ5o83npk;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

