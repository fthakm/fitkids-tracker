import React, { useState } from "react";
import { Box, Button, Select, MenuItem, Typography } from "@mui/material";
import StudentDetail from "./StudentDetail";
import AddEditStudentDialog from "../dialogs/AddEditStudentDialog";

export default function StudentList({ students, setStudents, showSnackbar }) {
  const [filterAge, setFilterAge] = useState("6-8");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);

  const handleAdd = () => {
    setSelectedStudent(null);
    setOpenAddEdit(true);
  };

  return (
    <Box mt={3}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Select value={filterAge} onChange={e => setFilterAge(e.target.value)}>
          <MenuItem value="6-8">6-8</MenuItem>
          <MenuItem value="9-11">9-11</MenuItem>
          <MenuItem value="12-15">12-15</MenuItem>
          <MenuItem value="16+">16+</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAdd}>Tambah Siswa</Button>
      </Box>

      {students.filter(s => s.age === filterAge).map((s) => (
        <Typography key={s.id || s.name} sx={{ cursor: "pointer", mb: 1 }} onClick={() => setSelectedStudent(s)}>
          {s.name}
        </Typography>
      ))}

      {openAddEdit && (
        <AddEditStudentDialog
          open={openAddEdit}
          onClose={() => setOpenAddEdit(false)}
          students={students}
          setStudents={setStudents}
          student={selectedStudent}
          showSnackbar={showSnackbar}
        />
      )}

      {selectedStudent && (
        <StudentDetail
          student={selectedStudent}
          setStudents={setStudents}
          showSnackbar={showSnackbar}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </Box>
  );
}
