import supabase from './supabaseClient';
const TABLE='student_results';
export async function getResultsByStudent(studentId,year=null,month=null){ let q=supabase.from(TABLE).select('*').eq('student_id',studentId).order('year',{ascending:false}).order('month',{ascending:false}); if(year) q=q.eq('year',year); if(month) q=q.eq('month',month); const {data,error}=await q; if(error) throw error; return data; }
export async function upsertMonthlyResult(payload){ const {data,error}=await supabase.from(TABLE).upsert([payload],{onConflict:['student_id','category_id','year','month']}).select(); if(error) throw error; return data; }
