import supabase from '../supabaseClient';

export const getCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) throw error;
  return data || [];
};
