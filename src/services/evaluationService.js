import { supabase } from "../supabaseClient";

// Ambil semua evaluasi
export async function getEvaluations() {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error getEvaluations:", error);
    throw error;
  }
  return data || [];
}

// Tambah evaluasi baru (biasanya cuma tanggal dulu)
export async function addEvaluation(evaluation) {
  const { data, error } = await supabase
    .from("evaluations")
    .insert([evaluation])
    .select()
    .single();

  if (error) {
    console.error("Error addEvaluation:", error);
    throw error;
  }
  return data;
}

// Update evaluasi (misalnya tambah hasil siswa)
export async function updateEvaluation(id, updates) {
  const { data, error } = await supabase
    .from("evaluations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updateEvaluation:", error);
    throw error;
  }
  return data;
}
