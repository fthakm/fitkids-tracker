import supabase from "../supabaseClient";

// Ambil leaderboard berdasarkan kategori tab (0 = rajin, 1 = terbaik, 2 = kurang aktif)
export async function getLeaderboard(tab = 0) {
  let query = supabase.from("student_results").select(`
    id,
    student_id,
    score,
    attendance,
    students ( name )
  `);

  const { data, error } = await query;
  if (error) throw error;

  // Hitung agregat per siswa
  const grouped = {};
  data.forEach((r) => {
    const name = r.students?.name || "Tanpa Nama";
    if (!grouped[name]) grouped[name] = { scores: [], attendances: [] };
    grouped[name].scores.push(r.score);
    grouped[name].attendances.push(r.attendance || 0);
  });

  const result = Object.keys(grouped).map((name) => {
    const scores = grouped[name].scores;
    const attend = grouped[name].attendances;
    const avgScore =
      scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    const avgAttend =
      attend.reduce((a, b) => a + b, 0) / (attend.length || 1);
    return {
      id: name,
      name,
      score: Math.round(avgScore),
      attendance: Math.round(avgAttend),
    };
  });

  // Urutkan berdasarkan kategori tab
  if (tab === 0) {
    // paling rajin
    return result.sort((a, b) => b.attendance - a.attendance);
  } else if (tab === 1) {
    // performa terbaik
    return result.sort((a, b) => b.score - a.score);
  } else {
    // kurang aktif
    return result.sort((a, b) => a.attendance - b.attendance);
  }
}
