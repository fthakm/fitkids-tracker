import { supabase } from "./supabaseClient";

const TABLE = "students";

// Get all students
export const getStudents = async () => {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw error;
  return data;
};

// Add a student
export const addStudent = async (student) => {
  const { data, error } = await supabase.from(TABLE).insert([{ ...student, results: [], badge: "" }]);
  if (error) throw error;
  return data;
};

// Update a student
export const updateStudent = async (student) => {
  const { data, error } = await supabase.from(TABLE).update(student).eq("name", student.name);
  if (error) throw error;
  return data;
};

// Delete a student
export const deleteStudent = async (name) => {
  const { data, error } = await supabase.from(TABLE).delete().eq("name", name);
  if (error) throw error;
  return data;
};

// Save student results
export const saveStudentResults = async (name, resultsInput, targetData) => {
  const date = new Date().toISOString().split("T")[0];
  const { data: students } = await supabase.from(TABLE).select("*").eq("name", name).single();
  const results = Object.keys(resultsInput).map(ex => ({
    date, exercise: ex, target: targetData[ex], value: Number(resultsInput[ex])
  }));
  const badge = results.every(r => r.value >= r.target) ? "✔" : "❌";
  const updatedResults = [...students.results, ...results];
  await supabase.from(TABLE).update({ results: updatedResults, badge }).eq("name", name);
};
