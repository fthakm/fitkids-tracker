// src/services/studentService.js
import { supabase } from "../supabaseClient";

// === STUDENTS ===
export async function getStudents() {
  const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveStudent(student) {
  const { error } = await supabase.from("students").insert([student]);
  if (error) throw error;
}

export async function updateStudent(id, student) {
  const { error } = await supabase.from("students").update(student).eq("id", id);
  if (error) throw error;
}

export async function deleteStudent(id) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}

// === RESULTS ===
export async function saveResult(result) {
  const { error } = await supabase.from("results").insert([result]);
  if (error) throw error;
}

export async function getResultsByStudent(studentId) {
  const { data, error } = await supabase.from("results").select("*, targets(test_name, min_score)").eq("student_id", studentId);
  if (error) throw error;
  return data;
}

// === TARGETS ===
export async function getTargets() {
  const { data, error } = await supabase.from("targets").select("*").order("test_name");
  if (error) throw error;
  return data;
}

// === BADGES ===
export async function getBadges() {
  const { data, error } = await supabase.from("badges").select("*");
  if (error) throw error;
  return data;
}

// === DASHBOARD VIEW ===
export async function getStudentDashboardData() {
  const { data, error } = await supabase.from("vw_student_with_results_targets").select("*");
  if (error) throw error;
  return data;
}
