// src/services/storageService.js
import { supabase } from "../supabaseClient";

const BUCKET = "student-photos";

export async function uploadStudentPhoto(file) {
  if (!file) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

// Hapus foto lama
export async function deleteStudentPhoto(photoUrl) {
  if (!photoUrl) return;

  try {
    const path = photoUrl.split("/").slice(-1)[0]; // ambil nama file dari URL
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.error("Delete error:", error);
  } catch (e) {
    console.error("deleteStudentPhoto error:", e);
  }
}
