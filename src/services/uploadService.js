import supabase from './supabaseClient';
// src/services/storageService.js
import { supabase } "../supabaseClient";

export async function uploadStudentPhoto(file) {
  if (!file) return null;

  const ext = file.name.split(".").pop(); // ambil ekstensi
  const fileName = `${Date.now()}.${ext}`; // biar lebih clean daripada pakai nama asli

  const { data, error } = await supabase.storage
    .from("student-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("student-photos")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
