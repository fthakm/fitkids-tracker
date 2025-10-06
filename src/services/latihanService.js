import supabase from './supabaseClient';

const TABLE = 'latihan_sessions';

/**
 * Ambil semua sesi latihan, urut berdasarkan jadwal terbaru.
 */
export async function getLatihanSessions() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('scheduled_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Ambil satu sesi latihan berdasarkan ID.
 */
export async function getSessionById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Buat atau perbarui sesi latihan.
 * Jika payload ada id → update, jika tidak → insert baru.
 */
export async function saveLatihanSession(payload) {
  let query;
  if (!payload.id) {
    query = supabase.from(TABLE).insert([payload]);
  } else {
    query = supabase.from(TABLE).update(payload).eq('id', payload.id);
  }

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

/**
 * Hapus sesi latihan berdasarkan ID.
 */
export async function deleteLatihanSession(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Ambil ringkasan latihan (evaluasi per sesi).
 */
export async function getLatihanSummary(sessionId) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('student_id, score, attendance')
    .eq('session_id', sessionId);
  if (error) throw error;
  return data;
}
