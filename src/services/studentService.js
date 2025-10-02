// services/studentService.js
import { createClient } from '@supabase/supabase-js';

// --- Supabase stub (ganti URL & anon key dengan milikmu) ---
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'public-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Fungsi CRUD ---

// Ambil semua siswa
export const getStudents = async () => {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getStudents error:', err);
    return [];
  }
};

// Simpan atau update siswa
export const saveStudent = async (student) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .upsert(student, { onConflict: 'id' }); // asumsi ada id
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('saveStudent error:', err);
    return null;
  }
};

// Hapus siswa
export const deleteStudent = async (id) => {
  try {
    const { data, error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('deleteStudent error:', err);
    return null;
  }
};

// Input hasil latihan siswa
export const saveResults = async (studentId, results) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .upsert(results.map(r => ({ student_id: studentId, ...r })));
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('saveResults error:', err);
    return null;
  }
};

// Ambil hasil latihan siswa
export const getResults = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('student_id', studentId);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getResults error:', err);
    return [];
  }
};

// Contoh fungsi tambahan: ambil leaderboard
export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id,name,age,badge,results');
    if (error) throw error;
    // hitung jumlah latihan tercapai per siswa
    return (data || []).sort((a,b) => {
      const aDone = (a.results || []).filter(r => r.value >= r.target).length;
      const bDone = (b.results || []).filter(r => r.value >= r.target).length;
      return bDone - aDone;
    });
  } catch (err) {
    console.error('getLeaderboard error:', err);
    return [];
  }
};
