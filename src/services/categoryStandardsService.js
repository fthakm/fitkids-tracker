import supabase from './supabaseClient';
const TABLE='category_standards';
export async function getStandardsByCategory(categoryId){ const {data,error}=await supabase.from(TABLE).select('*').eq('category_id',categoryId); if(error) throw error; return data; }
export async function upsertStandard(payload){ const {data,error}=await supabase.from(TABLE).upsert([payload]).select(); if(error) throw error; return data; }
