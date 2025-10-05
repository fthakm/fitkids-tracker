import supabase from '../supabaseClient';

export const getLatihanSessions = async () => {
  const { data, error } = await supabase.from('latihan_sessions').select('*').order('session_date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addLatihanSession = async (payload) => {
  const { data, error } = await supabase.from('latihan_sessions').insert([payload]).select();
  if (error) throw error;
  return data[0];
};
