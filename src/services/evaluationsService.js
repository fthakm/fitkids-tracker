import { supabase } from "../supabaseClient";

/**
 * Ambil ringkasan evaluasi siswa.
 * Jika month = "all", ambil rata-rata semua bulan.
 * Jika month = angka 1-12, filter berdasarkan bulan tersebut.
 */
export async function getEvaluasiSummary(month = "all") {
  try {
    let query = supabase
      .from("student_results")
      .select(`
        id,
        student_id,
        category_id,
        score_avg,
        year,
        month,
        students:student_id(full_name),
        categories:category_id(name)
      `)
      .order("score_avg", { ascending: false });

    if (month !== "all") {
      query = query.eq("month", parseInt(month));
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map((row) => ({
      id: row.id,
      name: row.students?.full_name || "Tanpa Nama",
      category: row.categories?.name || "-",
      averageScore: row.score_avg ?? 0,
      month: row.month,
      year: row.year,
    }));
  } catch (err) {
    console.error("Error getEvaluasiSummary:", err);
    return [];
  }
}

/**
 * Ambil semua evaluasi mentah dari tabel evaluations (opsional)
 */
export async function getEvaluationsRaw() {
  try {
    const { data, error } = await supabase
      .from("evaluations")
      .select(`
        id,
        student_id,
        session_id,
        score,
        attendance,
        notes,
        created_at,
        students:student_id(full_name),
        latihan_sessions:session_id(title)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error getEvaluationsRaw:", err);
    return [];
  }
}

/**
 * Simpan evaluasi baru
 */
export async function saveEvaluation(evaluation) {
  try {
    const { data, error } = await supabase
      .from("evaluations")
      .insert([evaluation])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.error("Error saveEvaluation:", err);
    return null;
  }
}
