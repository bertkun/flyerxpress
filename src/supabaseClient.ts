import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project credentials
const supabaseUrl = "https://tifovslxindgozlqtjix.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZm92c2x4aW5kZ296bHF0aml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDMzNDgsImV4cCI6MjA3MjExOTM0OH0.x7ljH0JhlutIrOEsTHe4nBrWhVA_Y9aiiRKfGfh1inE";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
