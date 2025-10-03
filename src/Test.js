// src/Test.js
import React, { useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function Test() {
  useEffect(() => {
    const checkSupabase = async () => {
      console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
      console.log("🔑 URL:", process.env.REACT_APP_SUPABASE_URL);
      console.log("🔑 KEY:", process.env.REACT_APP_SUPABASE_ANON_KEY?.slice(0,5) + "...");

      try {
        let { data, error } = await supabase.from("students").select("*").limit(1);
        if (error) {
          console.error("❌ Error fetch:", error.message);
        } else {
          console.log("✅ Data fetch success:", data);
        }
      } catch (err) {
        console.error("🔥 Unexpected error:", err);
      }
    };
    checkSupabase();
  }, []);

  return <h1>🔍 Cek Console untuk hasil</h1>;
}
