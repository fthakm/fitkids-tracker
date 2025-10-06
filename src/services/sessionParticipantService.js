import supabase from './supabaseClient';
const TABLE='session_participants';
export async function getParticipantsBySession(sessionId){ const {data,error}=await supabase.from(TABLE).select('*').eq('session_id',sessionId); if(error) throw error; return data; }
export async function addParticipant(sessionId,studentId,status='registered'){ const payload={session_id:sessionId,student_id:studentId,status}; const {data,error}=await supabase.from(TABLE).insert([payload]).select().single(); if(error) throw error; return data; }
export async function removeParticipant(sessionId,studentId){ const {data,error}=await supabase.from(TABLE).delete().match({session_id:sessionId,student_id:studentId}).select().single(); if(error) throw error; return data; }
