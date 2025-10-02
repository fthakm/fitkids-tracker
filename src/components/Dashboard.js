import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { fetchStudents } from "../services/studentService";
import OverviewChart from "./charts/OverviewChart";

export default function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, []);

  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1">Total Siswa</Typography>
            <Typography variant="h4">{students.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1">Capaian Rata-rata</Typography>
            <OverviewChart students={students} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
  }
