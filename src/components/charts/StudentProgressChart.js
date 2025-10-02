import React from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function StudentProgressChart({ student }) {
  if (!student.results || student.results.length === 0) return <Typography>Belum ada data latihan</Typography>;

  // Group by exercise
  const exercises = [...new Set(student.results.map(r => r.exercise))];
  const labels = [...new Set(student.results.map(r => r.date))];

  const datasets = exercises.map((ex, idx) => ({
    label: ex,
    data: labels.map(date => {
      const r = student.results.find(res => res.date === date && res.exercise === ex);
      return r ? r.value : null;
    }),
    borderColor: `hsl(${idx * 60}, 70%, 50%)`,
    backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.3)`,
    tension: 0.3
  }));

  return (
    <Box sx={{ mt: 2 }}>
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: { legend: { position: "top" }, title: { display: true, text: "Progress Latihan" } },
          scales: { y: { beginAtZero: true } }
        }}
      />
    </Box>
  );
}
