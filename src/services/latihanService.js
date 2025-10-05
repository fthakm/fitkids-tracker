import supabase from "../supabaseClient";

/**
 * Ambil semua sesi latihan
 */
export const getLatihanSessions = async () => {
  const { data, error } = await supabase
    .from("latihan_sessions")
    .select("id, date, exerciseType, students");

  if (error) throw error;
  return data || [];
};

/**
 * Simpan sesi latihan baru
 */
export const saveLatihanSession = async (sessionData) => {
  const { data, error } = await supabase
    .from("latihan_sessions")
    .insert([sessionData])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Hapus sesi latihan
 */
export const deleteLatihanSession = async (id) => {
  const { error } = await supabase.from("latihan_sessions").delete().eq("id", id);
  if (error) throw error;
};

/**
 * Update sesi latihan (opsional)
 */
export const updateLatihanSession = async (id, updates) => {
  const { data, error } = await supabase
    .from("latihan_sessions")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
};
