export const validateStudent = (student) => {
  if (!student.name?.trim()) return { valid: false, message: 'Nama wajib diisi' };
  if (!student.age) return { valid: false, message: 'Usia wajib diisi' };
  if (!student.gender) return { valid: false, message: 'Jenis kelamin wajib diisi' };
  if (!student.birthDate) return { valid: false, message: 'Tanggal lahir wajib diisi' };
  return { valid: true };
};

export const validateResults = (results, targetData) => {
  for (const ex of Object.keys(targetData)) {
    if (results[ex] === undefined || results[ex] === '') {
      return { valid: false, message: `Nilai ${ex} wajib diisi` };
    }
  }
  return { valid: true };
};
