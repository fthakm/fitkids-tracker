import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase ENV not found. Check Netlify settings!");
}

console.log("SUPABASE_URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.REACT_APP_SUPABASE_ANON_KEY?.slice(0,5) + "...");
