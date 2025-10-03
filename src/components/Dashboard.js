import React, { useEffect, useState } from "react";
import { getStudentDashboardData } from "../services/studentService";
import { Box, Typography, Paper, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4caf50", "#f44336"]; // hijau = achiever, merah = under

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState({});

  useEffect(() => {
    getStudentDashboardData().then((data) => {
      // kelompok usia
      const categories = {
        "6-8": { achiever: 0, under: 0 },
        "9-11": { achiever: 0, under: 0 },
        "12-15": { achiever: 0, under: 0 },
        "16+": { achiever: 0, under: 0 },
      };

      data.forEach((s) => {
        let cat = null;
        if (s.age >= 6 && s.age <= 8) cat = "6-8";
        else if (s.age >= 9 && s.age <= 11) cat = "9-11";
        else if (s.age >= 12 && s.age <= 15) cat = "12-15";
        else if (s.age >= 16) cat = "16+";

        if (!cat) return;

        // hitung rata-rata skor & target
        let avgScore = 0;
        let avgTarget = 0;
        if (s.results && s.results.length > 0) {
          const scores = s.results.map((r) => r.score);
          avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

          const targets = s.results.map((r) => r.target?.target_score || 0);
          avgTarget =
            targets.reduce((a, b) => a + b, 0) /
            (targets.filter((t) => t > 0).length || 1);
        }

        if (avgScore >= avgTarget) {
          categories[cat].achiever += 1;
        } else {
          categories[cat].under += 1;
        }
      });

      // bar chart data
      const formatted = Object.keys(categories).map((cat) => ({
        ageGroup: cat,
        Achiever: categories[cat].achiever,
        Underachiever: categories[cat].under,
      }));

      // pie chart data per kategori
      const pieFormatted = {};
      Object.keys(categories).forEach((cat) => {
        pieFormatted[cat] = [
          { name: "Achiever", value: categories[cat].achiever },
          { name: "Underachiever", value: categories[cat].under },
        ];
      });

      setChartData(formatted);
      setPieData(pieFormatted);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard Performa Siswa
      </Typography>

      {/* Grafik batang */}
      <Paper sx={{ p: 2, borderRadius: 2, height: 400, mb: 3 }}>
        <Typography variant="subtitle1">Perbandingan per Usia</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="ageGroup" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Achiever" fill="#4caf50" />
            <Bar dataKey="Underachiever" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Pie chart per kategori */}
      <Grid container spacing={2}>
        {Object.keys(pieData).map((cat) => (
          <Grid item xs={12} md={6} key={cat}>
            <Paper sx={{ p: 2, borderRadius: 2, height: 300 }}>
              <Typography variant="subtitle1" gutterBottom>
                Usia {cat}
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData[cat]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData[cat].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
            }
