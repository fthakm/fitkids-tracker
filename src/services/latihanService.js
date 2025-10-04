import { supabase } from "../supabaseClient";

export async function getAllLatihan() {
  const { data, error } = await supabase.from("latihan").select("*");
  if (error) throw error;
  return data;
}

export async function addLatihan(latihanData) {
  const { data, error } = await supabase.from("latihan").insert([latihanData]);
  if (error) throw error;
  return data;
}
