import { supabase } from '../supabaseClient';

export async function getEvaluations() {
  const { data, error } = await supabase.from('evaluations').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addEvaluation(evaluation) {
  const { data, error } = await supabase.from('evaluations').insert([evaluation]).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvaluation(id, updates) {
  const { data, error } = await supabase.from('evaluations').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
