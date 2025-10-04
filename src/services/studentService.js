import { supabase } from "../supabaseClient";

export async function getStudents() {
  const { data, error } = await supabase.from("students").select("*").order("name");
  if (error) throw error;
  return data || [];
}

export async function saveStudent(student) {
  const { data, error } = await supabase.from("students").insert([student]).select().single();
  if (error) throw error;
  return data;
}

export async function updateStudent(id, updates) {
  const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteStudent(id) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function saveResult(result) {
  const payload = {
    student_id: result.student_id,
    test_name: result.test_name,
    score: result.score,
    unit: result.unit ?? null,
    remarks: result.remarks ?? null,
    test_date: result.test_date ?? null,
  };
  const { error } = await supabase.from("results").insert([payload]);
  if (error) {
    console.error("saveResult error:", error);
    throw error;
  }
  return true;
}
