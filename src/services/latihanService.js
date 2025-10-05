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


// AUTO-ADDED placeholder for 'getLatihanSummary' — implement real logic
export const getLatihanSummary = async (...args) => {
  console.warn('placeholder getLatihanSummary called');
  return null;
};


// AUTO-ADDED placeholder for 'saveLatihanSession' — implement real logic
export const saveLatihanSession = async (...args) => {
  console.warn('placeholder saveLatihanSession called');
  return null;
};


// AUTO-ADDED placeholder for 'deleteLatihanSession' — implement real logic
export const deleteLatihanSession = async (...args) => {
  console.warn('placeholder deleteLatihanSession called');
  return null;
};
