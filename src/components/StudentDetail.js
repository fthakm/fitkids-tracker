import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import StudentProgressChart from "./charts/StudentProgressChart";
import { exportPDF, exportExcel } from "../utils/exportUtils";

export default function StudentDetail({ student, onBack }) {
  return (
    <Box mt={3}>
      <Button variant="outlined" onClick={onBack}>Kembali</Button>
      <Typography variant="h5" mt={2}>{student.name} ({student.age_group})</Typography>
      <Paper sx={{ p: 2, borderRadius: 2, mt: 2 }}>
        <Typography variant="subtitle1">Statistik Latihan</Typography>
        <StudentProgressChart student={student} />
      </Paper>
      <Box mt={2}>
        <Button variant="contained" sx={{ mr: 1 }} onClick={() => exportPDF(student)}>Export PDF</Button>
        <Button variant="contained" onClick={() => exportExcel(student)}>Export Excel</Button>
      </Box>
    </Box>
  );
}
