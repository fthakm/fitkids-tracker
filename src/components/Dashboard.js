import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import OverviewChart from "./charts/OverviewChart";

export default function Dashboard({ students }) {
  return (
    <Box mt={3}>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} md={6} key={student.id || student.name}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">{student.name}</Typography>
              <Typography variant="body2">Usia: {student.age}</Typography>
              <OverviewChart student={student} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Badge: {student.badge || "-"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
