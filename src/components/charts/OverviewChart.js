// src/components/charts/OverviewChart.js
import React from "react";
import { Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function OverviewChart({ student }) {
  if (!student?.results || student.results.length === 0) {
    return <Typography variant="body2">Belum ada data latihan</Typography>;
  }

  const exercises = [...new Set(student.results.map((r) => r.exercise))];
  const completed = exercises.map(
    (ex) =>
      student.results.filter(
        (r) => r.exercise === ex && r.value >= r.target
      ).length
  );
  const missed = exercises.map(
    (ex) =>
      student.results.filter(
        (r) => r.exercise === ex && r.value < r.target
      ).length
  );

  const data = {
    labels: exercises,
    datasets: [
      { label: "Tercapai", data: completed, backgroundColor: "#4caf50" },
      { label: "Tidak Tercapai", data: missed, backgroundColor: "#f44336" },
    ],
  };

  return <Pie data={data} />;
}
