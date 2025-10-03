// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Chip } from "@mui/material";
import { getStudentDashboardData } from "../services/studentService";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStudentDashboardData()
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {data.map((row) => (
        <Grid item xs={12} md={6} key={row.student_id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{row.name}</Typography>
              <Typography variant="body2">Umur: {row.age}</Typography>
              <Typography variant="body2">Tes: {row.test_name}</Typography>
              <Typography variant="body2">
                Nilai: {row.score} / Target {row.min_score}
              </Typography>
              {row.score >= row.min_score ? (
                <Chip label="✅ Lulus Target" color="success" />
              ) : (
                <Chip label="⚠️ Belum Tercapai" color="warning" />
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
