import supabase from '../supabaseClient';

export const getStudentResults = async (student_id) => {
  const { data, error } = await supabase.from('student_results').select('*').eq('student_id', student_id).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addStudentResult = async (payload) => {
  const { data, error } = await supabase.from('student_results').insert([payload]).select();
  if (error) throw error;
  return data[0];
};
