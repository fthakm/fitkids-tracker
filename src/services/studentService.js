// services/studentService.js
import { createClient } from '@supabase/supabase-js';

// --- Supabase stub (ganti URL & anon key dengan milikmu) ---
const supabaseUrl = 'https://azuemaldzmgopcdpgtnx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dWVtYWxkem1nb3BjZHBndG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDE3OTUsImV4cCI6MjA3NDk3Nzc5NX0.ch2SlSHPfkQej8RivRVjsL4A0w5X3OfFr5ylLD1PZy8';
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

// Simpan siswa baru atau update siswa
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

// Alias supaya bisa dipanggil updateStudent
export const updateStudent = saveStudent;

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

// Ambil leaderboard
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
