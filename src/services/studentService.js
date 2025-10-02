import { supabase } from './supabaseClient';

const TABLE = 'students';

// CRUD Siswa
export const getStudents = async () => {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return data;
};

export const addStudent = async (student) => {
  const { data, error } = await supabase.from(TABLE).insert([student]);
  if (error) throw error;
  return data;
};

export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase.from(TABLE).update(updates).eq('id', id);
  if (error) throw error;
  return data;
};

export const deleteStudent = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Input Hasil Latihan
export const addResults = async (studentId, results) => {
  const { data, error } = await supabase
    .from('results')
    .insert(results.map(r => ({ ...r, student_id: studentId })));
  if (error) throw error;
  return data;
};

export const getResults = async (studentId) => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId);
  if (error) throw error;
  return data;
};
