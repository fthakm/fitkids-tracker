// studentService.js
import { supabase } from "./supabaseClient";

// Ambil semua data siswa
export const getStudents = async () => {
  const { data, error } = await supabase.from("students").select("*");
  if (error) throw error;
  return data;
};

// Simpan data siswa baru
export const saveStudent = async (student) => {
  const { data, error } = await supabase.from("students").insert([student]);
  if (error) throw error;
  return data;
};

// Hapus siswa berdasarkan id
export const deleteStudent = async (id) => {
  const { data, error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
  return data;
};

// Ambil data siswa berdasarkan id
export const getStudentById = async (id) => {
  const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
};
