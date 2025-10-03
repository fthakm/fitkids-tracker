// src/services/studentService.js
import { supabase } from "../supabaseClient";
import { deleteStudentPhoto, uploadStudentPhoto } from "./storageService";

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
    gender: normalizeGender(student.gender),
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
  if (!id) return null;
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
  let photoUrl = student.photoUrl ?? null;

  // kalau ada file foto, upload
  if (student.photoFile) {
    photoUrl = await uploadStudentPhoto(student.photoFile);
  }

  const payload = {
    ...toDbStudentPayload(student),
    photo_url: photoUrl,
  };

  const { error } = await supabase.from("students").insert([payload]);
  if (error) {
    console.error("saveStudent error:", error);
    throw error;
  }
}

export async function updateStudent(id, student) {
  if (!id) {
    console.error("updateStudent error: ID tidak ada!");
    throw new Error("ID siswa tidak valid");
  }

  let photoUrl = student.photoUrl ?? null;

  // kalau ada foto baru → upload + hapus lama
  if (student.photoFile) {
    if (student.oldPhotoUrl) {
      await deleteStudentPhoto(student.oldPhotoUrl);
    }
    photoUrl = await uploadStudentPhoto(student.photoFile);
  }

  const payload = {
    ...toDbStudentPayload(student),
    photo_url: photoUrl,
  };

  const { error } = await supabase
    .from("students")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("updateStudent error:", error);
    throw error;
  }
}

export async function deleteStudent(student) {
  const id = student?.id ?? student?.student_id ?? student;
  if (!id) {
    throw new Error("deleteStudent error: missing id");
  }

  // hapus foto juga kalau ada
  if (student.photo_url) {
    await deleteStudentPhoto(student.photo_url);
  }

  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
}

// === RESULTS ===
export async function saveResult(results) {
  // Pastikan bentuknya array
  const payload = Array.isArray(results) ? results : [results];

  const { error } = await supabase.from("results").insert(payload);

  if (error) {
    console.error("saveResult error:", error);
    throw error;
  }
}

export async function getResultsByStudent(studentId) {
  if (!studentId) return [];
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
  const { data, error } = await supabase
    .from("targets")
    .select("*")
    .order("test_name");

  if (error) {
    console.error("getTargets error:", error);
    return [];
  }
  return data || [];
}

// ambil target spesifik sesuai usia student
export async function getTargetsByStudent(studentId) {
  if (!studentId) return [];

  try {
    // ambil umur student dari view
    const { data: student, error: studentError } = await supabase
      .from("vw_students_with_age")
      .select("id, age, birth_date")
      .eq("id", studentId)
      .single();

    if (studentError) throw studentError;
    if (!student) return [];

    // kalau kolom age ga ada, hitung manual dari birth_date
    let age = student.age;
    if (!age && student.birth_date) {
      const birthDate = new Date(student.birth_date);
      const today = new Date();
      age =
        today.getFullYear() -
        birthDate.getFullYear() -
        (today <
        new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
          ? 1
          : 0);
    }

    if (!age) return [];

    // mapping kategori usia
    let ageCategory = null;
    if (age >= 6 && age <= 8) ageCategory = "6-8";
    else if (age >= 9 && age <= 11) ageCategory = "9-11";
    else if (age >= 12 && age <= 15) ageCategory = "12-15";
    else if (age >= 16) ageCategory = "16+";

    if (!ageCategory) return [];

    // ambil target dari tabel sesuai kolom age_group
    const { data: targets, error: targetsError } = await supabase
      .from("targets")
      .select("*")
      .eq("age_group", ageCategory);

    if (targetsError) throw targetsError;

    return targets || [];
  } catch (err) {
    console.error("getTargetsByStudent error:", err.message);
    return [];
  }
}

// === BADGES ===
export async function getBadgesByStudent(studentId) {
  if (!studentId) return [];
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
