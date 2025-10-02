import React from "react";
import { Line } from "react-chartjs-2";

export default function StudentProgressChart({ student }) {
  if(!student) return null;

  const exercises = [...new Set(student.results.map(r=>r.exercise))];
  const datasets = exercises.map(ex=>({
    label: ex,
    data: student.results.filter(r=>r.exercise===ex).map(r=>r.value),
    fill: false,
    borderColor: "#" + Math.floor(Math.random()*16777215).toString(16)
  }));

  return <Line data={{ labels: student.results.map(r=>r.date), datasets }}/>;
}
