// src/services/studentService.js
import { supabase } from "../supabaseClient";

export async function getStudents() {
  const { data, error } = await supabase.from("students").select("*");
  if (error) throw error;
  return data;
}

export async function saveStudent(student) {
  const { error } = await supabase.from("students").insert([student]);
  if (error) throw error;
}

export async function updateStudent(id, student) {
  const { error } = await supabase
    .from("students")
    .update(student)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteStudent(id) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}

export async function getResultsByStudent(studentId) {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("student_id", studentId);
  if (error) throw error;
  return data;
}

export async function saveResults(results) {
  const { error } = await supabase.from("results").insert([results]);
  if (error) throw error;
}
