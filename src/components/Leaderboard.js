import React, { useEffect, useState } from "react";
import { getStudentDashboardData } from "../services/studentService";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudentDashboardData().then((data) => {
      // Hitung skor rata-rata per siswa
      const ranked = data.map((s) => {
        const scores = (s.results || []).map((r) => r.score);
        const avg = scores.length
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

        // Cek rekomendasi berdasarkan hasil vs target
        let recommendations = [];
        (s.results || []).forEach((r) => {
          if (r.target && r.score < r.target.target_score) {
            recommendations.push(
              `Perbanyak latihan ${r.test_type} (target: ${r.target.target_score}, kamu: ${r.score})`
            );
          }
        });

        if (recommendations.length === 0) {
          recommendations.push("Mantap! Semua target tercapai 🎉");
        }

        return { ...s, avgScore: Math.round(avg), recommendations };
      });

      // Urutkan descending
      ranked.sort((a, b) => b.avgScore - a.avgScore);
      setStudents(ranked);
    });
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Leaderboard
      </Typography>
      <Grid container spacing={2}>
        {students.map((s, idx) => (
          <Grid item xs={12} key={s.student_id}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{ width: 40, textAlign: "center", mr: 2 }}
              >
                #{idx + 1}
              </Typography>
              <Avatar
                src={s.photo_url || ""}
                sx={{ width: 56, height: 56, mr: 2 }}
              >
                {s.name.charAt(0)}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="subtitle1">{s.name}</Typography>
                <Typography variant="body2">
                  Rata-rata skor: {s.avgScore}
                </Typography>

                {/* Badge */}
                <Box mt={1}>
                  {s.badges && s.badges.length > 0 ? (
                    s.badges.map((b, i) => (
                      <Chip
                        key={i}
                        label={b.badge_name}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Belum ada badge
                    </Typography>
                  )}
                </Box>

                {/* Rekomendasi latihan */}
                <Box mt={2}>
                  <Typography variant="subtitle2">Rekomendasi:</Typography>
                  <List dense>
                    {s.recommendations.map((rec, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={`- ${rec}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
                  }
