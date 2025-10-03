// src/services/storageService.js
import { supabase } from "../supabaseClient";

export async function uploadStudentPhoto(file) {
  if (!file) return null;

  const ext = file.name.split(".").pop(); 
  const fileName = `${Date.now()}.${ext}`; 

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

// ✅ Fungsi untuk hapus foto lama
export async function deleteStudentPhoto(photoUrl) {
  if (!photoUrl) return;

  try {
    // Ambil path dari URL publik
    const url = new URL(photoUrl);
    const path = url.pathname.split("/storage/v1/object/public/student-photos/")[1];

    if (!path) return;

    const { error } = await supabase.storage
      .from("student-photos")
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }
  } catch (err) {
    console.error("deleteStudentPhoto error:", err);
  }
}
