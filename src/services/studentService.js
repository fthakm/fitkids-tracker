const STORAGE_KEY = "fitkids-students";

export const getStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addStudent = (student) => {
  const students = getStudents();
  students.push({...student, results:[], badge:""});
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const updateStudent = (student) => {
  const students = getStudents().map(s=>s.name===student.name?student:s);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const deleteStudent = (name) => {
  const students = getStudents().filter(s=>s.name!==name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const saveStudentResults = (name, resultsInput, targetData) => {
  const date = new Date().toISOString().split("T")[0];
  const students = getStudents().map(s=>{
    if(s.name !== name) return s;
    const results = Object.keys(resultsInput).map(ex=>({
      date, exercise: ex, target: targetData[ex], value: Number(resultsInput[ex])
    }));
    const badge = results.every(r=>r.value>=r.target) ? "✔" : "❌";
    return {...s, results: [...s.results, ...results], badge};
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};
