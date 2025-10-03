// src/components/charts/StudentProgressChart.js
import React from "react";
import { Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function StudentProgressChart({ student }) {
  if (!student?.results || student.results.length === 0) {
    return <Typography variant="body2">Belum ada data latihan</Typography>;
  }

  const exercises = [...new Set(student.results.map((r) => r.exercise))];
  const labels = [...new Set(student.results.map((r) => r.date))];

  const datasets = exercises.map((ex, idx) => ({
    label: ex,
    data: labels.map((date) => {
      const r = student.results.find(
        (rr) => rr.exercise === ex && rr.date === date
      );
      return r ? r.value : 0;
    }),
    borderColor: `hsl(${idx * 60}, 70%, 50%)`,
    backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.3)`,
    tension: 0.3,
  }));

  const data = { labels, datasets };

  return <Line data={data} />;
}
