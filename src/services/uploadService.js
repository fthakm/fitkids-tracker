// src/services/storageService.js
import { supabase } from "../supabaseClient";

export async function uploadStudentPhoto(file) {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("student-photos") // ✅ pastikan bucket ini sudah dibuat di Supabase
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false, // biar gak overwrite kalau ada nama sama
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  // ambil public URL
  const { data: publicUrlData } = supabase.storage
    .from("student-photos")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
