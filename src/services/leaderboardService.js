import { supabase } from "../supabaseClient";

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("total_score", { ascending: false });

  if (error) throw error;
  return data.map((item, i) => ({
    ...item,
    rank: i + 1,
  }));
}
