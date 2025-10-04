import { supabase } from "../supabaseClient";

export async function getAllEvaluasi() {
  const { data, error } = await supabase
    .from("evaluasi")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function filterEvaluasi(studentId, month) {
  let query = supabase
    .from("evaluasi")
    .select("*")
    .gte("month", month)
    .lte("month", month);

  if (studentId !== "all") query = query.eq("student_id", studentId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
