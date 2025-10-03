// src/services/studentService.js
import { supabase } from "../supabaseClient";

/**
 * NOTE:
 * - Frontend often uses camelCase (birthDate). DB uses snake_case (birth_date).
 * - Service maps/sanitizes incoming data before insert/update.
 */

function toDbStudentPayload(student) {
  // map camelCase -> snake_case for DB
  return {
    name: student.name ?? null,
    birth_date: student.birthDate ?? student.birth_date ?? null,
    birth_place: student.birthPlace ?? student.birth_place ?? null,
    address: student.address ?? null,
    gender: student.gender ?? null,
    phone: student.phone ?? null,
    parent_name: student.parentName ?? student.parent_name ?? null,
    parent_contact: student.parentContact ?? student.parent_contact ?? null,
    photo_url: student.photoUrl ?? student.photo_url ?? null,
  };
}

// === STUDENTS (use simple view or table) ===
export async function getStudents() {
  const { data, error } = await supabase.from("fitkids.vw_students_with_age").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getStudents error:", error);
    return [];
  }
  return data || [];
}

export async function getStudentById(id) {
  const { data, error } = await supabase.from("fitkids.vw_student_with_results_targets").select("*").eq("student_id", id).limit(1);
  if (error) {
    console.error("getStudentById error:", error);
    return null;
  }
  return (data && data[0]) || null;
}

export async function saveStudent(student) {
  const payload = toDbStudentPayload(student);
  const { error } = await supabase.from("fitkids.students").insert([payload]);
  if (error) {
    console.error("saveStudent error:", error);
    throw error;
  }
}

export async function updateStudent(id, student) {
  const payload = toDbStudentPayload(student);
  const { error } = await supabase.from("fitkids.students").update(payload).eq("id", id);
  if (error) {
    console.error("updateStudent error:", error);
    throw error;
  }
}

export async function deleteStudent(id) {
  const { error } = await supabase.from("fitkids.students").delete().eq("id", id);
  if (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

// === RESULTS ===
export async function saveResult(result) {
  // result should be { student_id, test_name, score, unit?, remarks?, test_date? }
  const payload = {
    student_id: result.student_id,
    test_name: result.test_name,
    score: result.score,
    unit: result.unit ?? null,
    remarks: result.remarks ?? null,
    test_date: result.test_date ?? null
  };
  const { error } = await supabase.from("fitkids.results").insert([payload]);
  if (error) {
    console.error("saveResult error:", error);
    throw error;
  }
}

export async function getResultsByStudent(studentId) {
  const { data, error } = await supabase.from("fitkids.results").select("*").eq("student_id", studentId).order("test_date", { ascending: false });
  if (error) {
    console.error("getResultsByStudent error:", error);
    return [];
  }
  return data || [];
}

// === TARGETS ===
export async function getTargets() {
  const { data, error } = await supabase.from("fitkids.targets").select("*").order("test_name");
  if (error) {
    console.error("getTargets error:", error);
    return [];
  }
  return data || [];
}

// === BADGES / RECOMMENDATIONS ===
export async function getBadgesByStudent(studentId) {
  const { data, error } = await supabase.from("fitkids.student_badges as sb")
    .select("sb.id, sb.awarded_at, b.badge_name, b.description")
    .eq("sb.student_id", studentId)
    .join("fitkids.badges as b", "sb.badge_id", "b.id");
  if (error) {
    console.error("getBadgesByStudent error:", error);
    return [];
  }
  return data || [];
}

export async function getStudentDashboardData() {
  // view returns one row per student with nested results/targets as JSON
  const { data, error } = await supabase.from("fitkids.vw_student_with_results_targets").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getStudentDashboardData error:", error);
    return [];
  }
  return data || [];
}
