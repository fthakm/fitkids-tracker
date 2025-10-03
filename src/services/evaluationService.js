import { supabase } from "@/supabaseClient";

// Ambil semua evaluasi
export async function getEvaluations() {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*, students(name, birthdate)")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// Ambil evaluasi per siswa
export async function getEvaluationsByStudent(studentId) {
  const { data, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// Tambah evaluasi baru
export async function addEvaluation({ studentId, date, ageGroup, results }) {
  const { data, error } = await supabase
    .from("evaluations")
    .insert([
      {
        student_id: studentId,
        date,
        age_group: ageGroup,
        results,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
