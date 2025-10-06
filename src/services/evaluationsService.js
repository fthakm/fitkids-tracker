import supabase from './supabaseClient';
const TABLE='evaluations';
export async function getEvaluationsBySession(sessionId){ const {data,error}=await supabase.from(TABLE).select('*').eq('session_id',sessionId); if(error) throw error; return data; }
export async function getEvaluationsByStudent(studentId){ const {data,error}=await supabase.from(TABLE).select('*').eq('student_id',studentId).order('created_at',{ascending:false}); if(error) throw error; return data; }
export async function saveEvaluation(payload){ const {data,error}=await supabase.from(TABLE).insert([payload]).select().single(); if(error) throw error; return data; }
export async function updateEvaluation(id,payload){ const {data,error}=await supabase.from(TABLE).update(payload).eq('id',id).select().single(); if(error) throw error; return data; }
export async function deleteEvaluation(id){ const {data,error}=await supabase.from(TABLE).delete().eq('id',id).select().single(); if(error) throw error; return data; }
