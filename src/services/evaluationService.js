import { supabase } from "./supabaseClient";

export async function getEvaluations() {
  const { data, error } = await supabase.from("evaluations").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addEvaluation(evaluation) {
  const { data, error } = await supabase.from("evaluations").insert([evaluation]).select();
  if (error) throw error;
  return data[0];
}

export async function deleteEvaluation(id) {
  const { error } = await supabase.from("evaluations").delete().eq("id", id);
  if (error) throw error;
}
