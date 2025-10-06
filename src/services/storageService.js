
// src/services/storageService.j
import { supabase } "./supabaseClient";

const BUCKET = "student-photos";

export async function uploadStudentPhoto(file, studentId = null) {
  if (!file) return null;

  // bisa pakai folder student biar lebih rapi
  const folder = studentId ? `${studentId}` : "general";
  const fileName = `${folder}/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  // ambil public URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return {
    publicUrl: data.publicUrl,
    path: fileName, // simpan path ini ke DB, buat hapus nanti
  };
}

// Hapus foto lama by path
export async function deleteStudentPhoto(path) {
  if (!path) return;

  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) console.error("Delete error:", error);
  } catch (e) {
    console.error("deleteStudentPhoto error:", e);
  }
}
