import React from "react";
import { Paper, Typography } from "@mui/material";

export default function Dashboard({ students }) {
  if (!students || students.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Belum ada data siswa</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Dashboard</Typography>
      <Typography>Total siswa: {students.length}</Typography>
    </Paper>
  );
}
