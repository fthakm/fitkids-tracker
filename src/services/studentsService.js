import supabase from './supabaseClient';
const TABLE = 'students';
export async function getAllStudents(){ const {data,error}=await supabase.from(TABLE).select('*').order('full_name'); if(error) throw error; return data; }
export async function getStudentById(id){ const {data,error}=await supabase.from(TABLE).select('*').eq('id',id).single(); if(error) throw error; return data; }
export async function createStudent(payload){ const {data,error}=await supabase.from(TABLE).insert([payload]).select().single(); if(error) throw error; return data; }
export async function updateStudent(id,payload){ const {data,error}=await supabase.from(TABLE).update(payload).eq('id',id).select().single(); if(error) throw error; return data; }
export async function deleteStudent(id){ const {data,error}=await supabase.from(TABLE).delete().eq('id',id).select().single(); if(error) throw error; return data; }
