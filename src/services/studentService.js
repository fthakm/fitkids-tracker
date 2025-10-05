import supabase from "../supabaseClient";

/** === CRUD SISWA === **/
export const getStudents = async () => {
  const { data, error } = await supabase.from("students").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data;
};

export const addStudent = async (student) => {
  const { data, error } = await supabase.from("students").insert([student]).select();
  if (error) throw error;
  return data[0];
};

export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase.from("students").update(updates).eq("id", id).select();
  if (error) throw error;
  return data[0];
};

export const deleteStudent = async (id) => {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
};

/** === RELASI SISWA ⇄ LATIHAN === **/
export const getResultsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from("latihan_sessions")
    .select("id, date, exerciseType, students")
    .contains("students", [studentId]); // array berisi ID siswa

  if (error) throw error;
  return data;
};
