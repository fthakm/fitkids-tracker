import supabase from './supabaseClient';
const TABLE='categories';
export async function getAllCategories(){ const {data,error}=await supabase.from(TABLE).select('*').order('name'); if(error) throw error; return data; }
export async function getCategoryById(id){ const {data,error}=await supabase.from(TABLE).select('*').eq('id',id).single(); if(error) throw error; return data; }
export async function createCategory(payload){ const {data,error}=await supabase.from(TABLE).insert([payload]).select().single(); if(error) throw error; return data; }
export async function updateCategory(id,payload){ const {data,error}=await supabase.from(TABLE).update(payload).eq('id',id).select().single(); if(error) throw error; return data; }
export async function deleteCategory(id){ const {data,error}=await supabase.from(TABLE).delete().eq('id',id).select().single(); if(error) throw error; return data; }
