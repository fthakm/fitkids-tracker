import React, { useEffect, useState } from "react";
import { getStudentDashboardData } from "../services/studentService";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";

export default function Dashboard({ students }) {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    getStudentDashboardData().then(setDashboardData);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard Siswa
      </Typography>
      <Grid container spacing={2}>
        {dashboardData.map((s) => (
          <Grid item xs={12} md={6} key={s.student_id}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">{s.name}</Typography>
              <Typography variant="body2">Umur: {s.age} th</Typography>
              <Typography variant="body2">Alamat: {s.address}</Typography>
              <Box mt={1}>
                <Typography variant="subtitle2">Badges:</Typography>
                {s.badges && s.badges.length > 0 ? (
                  s.badges.map((b, idx) => (
                    <Chip key={idx} label={b.badge_name} sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Typography variant="body2">Belum ada</Typography>
                )}
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2">Hasil Tes:</Typography>
                {s.results && s.results.length > 0 ? (
                  s.results.map((r, idx) => (
                    <Typography key={idx} variant="body2">
                      {r.test_name}: {r.score} {r.unit || ""} ({r.test_date})
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2">Belum ada hasil</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
          }
