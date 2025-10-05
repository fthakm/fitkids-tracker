import React from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function StudentDetail({ student }) {
  if (!student) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Belum ada siswa dipilih</Typography>
      </Paper>
    );
  }

  // Data dummy untuk grafik progress
  const progressData = student.results?.map((r, i) => ({
    name: `T${i + 1}`,
    score: r.score,
  })) || [];

  // Group hasil per jenis tes (untuk bar chart)
  const testSummary = student.results?.reduce((acc, r) => {
    const existing = acc.find((t) => t.test === r.test_name);
    if (existing) {
      existing.score = (existing.score + r.score) / 2;
    } else {
      acc.push({ test: r.test_name, score: r.score });
    }
    return acc;
  }, []) || [];

  // Hitung statistik
  const scores = student.results?.map((r) => r.score) || [];
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
  const max = scores.length ? Math.max(...scores) : 0;
  const min = scores.length ? Math.min(...scores) : 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          src={student.photo_url || ""}
          sx={{ width: 72, height: 72, mr: 2 }}
        >
          {student.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6">{student.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Umur {student.age} tahun
          </Typography>
        </Box>
      </Box>

      {/* Stat box */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6">{avg}</Typography>
            <Typography variant="body2">Average</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6">{max}</Typography>
            <Typography variant="body2">Highest</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6">{min}</Typography>
            <Typography variant="body2">Lowest</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Grafik */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Progress
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Fitness by Test
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={testSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Badges */}
      <Box mb={2}>
        <Typography variant="subtitle2">Badges:</Typography>
        {student.badges && student.badges.length > 0 ? (
          student.badges.map((b, i) => (
            <Chip key={i} label={b.badge_name} sx={{ mr: 1, mb: 1 }} />
          ))
        ) : (
          <Typography variant="body2">Belum ada badge</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tombol navigasi */}
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined">Test Details</Button>
        <Button variant="outlined">Semester Review</Button>
      </Box>
    </Paper>
  );
}
            
