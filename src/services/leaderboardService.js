import { supabase } from '../supabaseClient';

export async function getLeaderboardSummary() {
  // placeholder: aggregate results by student to compute avg score & badges
  const { data, error } = await supabase.rpc('leaderboard_summary');
  if (error) {
    console.warn('rpc leaderboard_summary failed, returning empty');
    return [];
  }
  return data || [];
}
