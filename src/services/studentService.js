import supabase from './supabaseClient';

export const getStudents = async () => {
  const { data, error } = await supabase.from('students').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const addStudent = async (payload) => {
  const { data, error } = await supabase.from('students').insert([payload]).select();
  if (error) throw error;
  return data[0];
};

export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase.from('students').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteStudent = async (id) => {
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) throw error;
  return true;
};
