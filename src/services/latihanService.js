import { supabase } from '../supabaseClient';

export async function addLatihan(latihan) {
  const { data, error } = await supabase.from('latihan').insert([latihan]).select().single();
  if (error) throw error;
  return data;
}

export async function getLatihanList() {
  const { data, error } = await supabase.from('latihan').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}
