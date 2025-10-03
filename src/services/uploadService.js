import { supabase } from "../supabaseClient";

export async function uploadStudentPhoto(file) {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("student-photos") // 👈 pastikan sudah bikin bucket di Supabase
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from("student-photos")
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}
