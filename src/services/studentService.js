import { supabase } from "./supabaseClient";

// Stub service untuk CRUD siswa
export const studentService = {
  getAllStudents: async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },
  addStudent: async (student) => {
    const { data, error } = await supabase.from("students").insert([student]);
    if (error) throw error;
    return data[0];
  },
  updateStudent: async (id, updates) => {
    const { data, error } = await supabase.from("students").update(updates).eq("id", id);
    if (error) throw error;
    return data[0];
  },
  deleteStudent: async (id) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw error;
  },
};
