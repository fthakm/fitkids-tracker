import React from "react";
import { Bar } from "react-chartjs-2";
import { getStudents } from "../services/studentService";

export default function OverviewChart() {
  const students = getStudents();
  const labels = students.map(s=>s.name);
  const data = students.map(s=>s.results.filter(r=>r.value>=r.target).length);

  return <Bar data={{ labels, datasets:[{ label:"Latihan Memenuhi Target", data, backgroundColor:"rgba(75,192,192,0.6)" }] }}/>;
}
