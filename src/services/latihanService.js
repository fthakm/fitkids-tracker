import supabase from './supabaseClient';
const TABLE='latihan_sessions';
export async function getAllSessions(){ const {data,error}=await supabase.from(TABLE).select('*').order('scheduled_at',{ascending:false}); if(error) throw error; return data; }
export async function getSessionById(id){ const {data,error}=await supabase.from(TABLE).select('*').eq('id',id).single(); if(error) throw error; return data; }
export async function createSession(payload){ const {data,error}=await supabase.from(TABLE).insert([payload]).select().single(); if(error) throw error; return data; }
export async function updateSession(id,payload){ const {data,error}=await supabase.from(TABLE).update(payload).eq('id',id).select().single(); if(error) throw error; return data; }
export async function deleteSession(id){ const {data,error}=await supabase.from(TABLE).delete().eq('id',id).select().single(); if(error) throw error; return data; }
export async function getLatihanSummary(sessionId){ const {data,error}=await supabase.from('evaluations').select('student_id,score,attendance').eq('session_id',sessionId); if(error) throw error; return data; }
