import React, { useEffect, useState } from "react";
import { getStudentDashboardData } from "../services/studentService";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";

export default function Leaderboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudentDashboardData().then((data) => {
      const ranked = data.map((s) => {
        const scores = (s.results || []).map((r) => r.score);
        const avg = scores.length
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;
        const badgeCount = s.badges ? s.badges.length : 0;

        return { ...s, avgScore: Math.round(avg), badgeCount };
      });

      // Urutkan: jumlah badge desc → avgScore desc
      ranked.sort((a, b) => {
        if (b.badgeCount !== a.badgeCount) {
          return b.badgeCount - a.badgeCount;
        }
        return b.avgScore - a.avgScore;
      });

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
              {/* Peringkat */}
              <Typography
                variant="h6"
                sx={{ width: 40, textAlign: "center", mr: 2 }}
              >
                #{idx + 1}
              </Typography>

              {/* Avatar */}
              <Avatar
                src={s.photo_url || ""}
                sx={{ width: 56, height: 56, mr: 2 }}
              >
                {s.name.charAt(0)}
              </Avatar>

              {/* Info siswa */}
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
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
