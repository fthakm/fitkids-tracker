import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import InputResultsDialog from "../dialogs/InputResultsDialog";
import { exportPDF, exportExcel } from "../utils/exportUtils";
import AddEditStudentDialog from "../dialogs/AddEditStudentDialog";

export default function StudentDetail({ student, setStudents, showSnackbar, onClose }) {
  const [openInput, setOpenInput] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Box mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6">{student.name}</Typography>
      <Typography>Usia: {student.age}</Typography>
      <Typography>Tempat tinggal: {student.address || "-"}</Typography>
      <Typography>Jenis kelamin: {student.gender || "-"}</Typography>
      <Box mt={1}>
        <Button sx={{ mr: 1 }} variant="outlined" onClick={() => exportPDF(student)}>Export PDF</Button>
        <Button sx={{ mr: 1 }} variant="outlined" onClick={() => exportExcel(student)}>Export Excel</Button>
        <Button sx={{ mr: 1 }} variant="contained" onClick={() => setOpenInput(true)}>Input Nilai</Button>
        <Button variant="contained" color="secondary" onClick={() => setOpenEdit(true)}>Edit</Button>
      </Box>

      {openInput && (
        <InputResultsDialog
          student={student}
          setStudents={setStudents}
          onClose={() => setOpenInput(false)}
          showSnackbar={showSnackbar}
        />
      )}

      {openEdit && (
        <AddEditStudentDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          students={setStudents}
          setStudents={setStudents}
          student={student}
          showSnackbar={showSnackbar}
        />
      )}

      <Button sx={{ mt: 2 }} onClick={onClose}>Tutup</Button>
    </Box>
  );
  }
