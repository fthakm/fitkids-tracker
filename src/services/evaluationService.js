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

// Tambah evaluasi baru
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

// Update evaluasi
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

// 🆕 Ambil evaluasi berdasarkan siswa
export async function getEvaluationsByStudent(studentId) {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("student_id", studentId) // cek nama kolom!
    .order("date", { ascending: false });

  if (error) {
    console.error("Error getEvaluationsByStudent:", error);
    throw error;
  }
  return data || [];
}
