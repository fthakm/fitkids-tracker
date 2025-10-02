export const validateStudent = (student) => {
  if (!student.name?.trim()) return "Nama siswa wajib diisi";
  if (!student.age) return "Usia wajib dipilih";
  return null;
};
