// src/services/studentService.js
import { supabase } from "../supabaseClient";

// helper buat mapping gender
function normalizeGender(gender) {
  if (!gender) return null;
  const g = gender.toString().toLowerCase();
  if (g === "l" || g === "male" || g === "laki-laki") return "L";
  if (g === "p" || g === "female" || g === "perempuan") return "P";
  return null;
}

function toDbStudentPayload(student) {
  return {
    name: student.name ?? null,
    birth_date: student.birthDate ?? student.birth_date ?? null,
    birth_place: student.birthPlace ?? student.birth_place ?? null,
    address: student.address ?? null,
    gender: normalizeGender(student.gender), // ✅ normalisasi gender
    phone: student.phone ?? null,
    parent_name: student.parentName ?? student.parent_name ?? null,
    parent_contact: student.parentContact ?? student.parent_contact ?? null,
    photo_url: student.photoUrl ?? student.photo_url ?? null,
  };
}

// === STUDENTS ===
export async function getStudents() {
  const { data, error } = await supabase
    .from("vw_students_with_age")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getStudents error:", error);
    return [];
  }
  return data || [];
}

export async function getStudentById(id) {
  const { data, error } = await supabase
    .from("vw_student_with_results_targets")
    .select("*")
    .eq("student_id", id)
    .limit(1);

  if (error) {
    console.error("getStudentById error:", error);
    return null;
  }
  return (data && data[0]) || null;
}

export async function saveStudent(student) {
  const payload = toDbStudentPayload(student);
  const { error } = await supabase.from("students").insert([payload]);
  if (error) {
    console.error("saveStudent error:", error);
    throw error;
  }
}

export async function updateStudent(id, student) {
  const payload = toDbStudentPayload(student);
  const { error } = await supabase.from("students").update(payload).eq("id", id);
  if (error) {
    console.error("updateStudent error:", error);
    throw error;
  }
}

export async function deleteStudent(id) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

// === RESULTS ===
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
}

export async function getResultsByStudent(studentId) {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false });

  if (error) {
    console.error("getResultsByStudent error:", error);
    return [];
  }
  return data || [];
}

// === TARGETS ===
export async function getTargets() {
  const { data, error } = await supabase.from("targets").select("*").order("test_name");
  if (error) {
    console.error("getTargets error:", error);
    return [];
  }
  return data || [];
}

// === BADGES ===
export async function getBadgesByStudent(studentId) {
  const { data, error } = await supabase
    .from("student_badges")
    .select("id, awarded_at, badges ( badge_name, description )")
    .eq("student_id", studentId);

  if (error) {
    console.error("getBadgesByStudent error:", error);
    return [];
  }
  return data || [];
}

export async function getStudentDashboardData() {
  const { data, error } = await supabase
    .from("vw_student_with_results_targets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getStudentDashboardData error:", error);
    return [];
  }
  return data || [];
}
