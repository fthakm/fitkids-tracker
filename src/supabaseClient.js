import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase ENV not found. Check Netlify settings!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hanya log di dev mode
if (process.env.NODE_ENV !== "production") {
  console.log("✅ SUPABASE_URL:", supabaseUrl);
  console.log("✅ SUPABASE_KEY:", supabaseAnonKey?.slice(0, 5) + "...");
}
