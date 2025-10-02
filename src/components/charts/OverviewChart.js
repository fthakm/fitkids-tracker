import React from "react";
import { Box, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function OverviewChart({ student }) {
  if (!student.results || student.results.length === 0) return <Typography>Belum ada data latihan</Typography>;

  const exercises = [...new Set(student.results.map(r => r.exercise))];
  const completed = exercises.map(ex => student.results.filter(r => r.exercise === ex && r.value >= r.target).length);
  const missed = exercises.map(ex => student.results.filter(r => r.exercise === ex && r.value < r.target).length);

  const data = {
    labels: exercises,
    datasets: [
      {
        label: "Latihan Tercapai",
        data: completed,
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      },
      {
        label: "Latihan Tidak Tercapai",
        data: missed,
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Pie
        data={data}
        options={{
          responsive: true,
          plugins: { legend: { position: "bottom" }, title: { display: true, text: "Rangkuman Latihan" } }
        }}
      />
    </Box>
  );
}
