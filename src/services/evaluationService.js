import supabase from "../supabaseClient";

// Ambil rekap nilai rata-rata siswa per bulan
export async function getEvaluasiSummary(month = "all") {
  let query = supabase.from("student_results").select(`
    id,
    student_id,
    score,
    month,
    students ( name )
  `);

  if (month !== "all") query = query.eq("month", month);

  const { data, error } = await query;
  if (error) throw error;

  // Kelompokkan & hitung rata-rata
  const grouped = {};
  data.forEach((r) => {
    const name = r.students?.name || "Tanpa Nama";
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(r.score);
  });

  return Object.keys(grouped).map((name, index) => {
    const scores = grouped[name];
    const avg =
      scores.reduce((acc, s) => acc + s, 0) / (scores.length || 1);
    return {
      id: index,
      name,
      averageScore: Math.round(avg),
    };
  });
}
