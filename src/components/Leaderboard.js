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

  // Rekomendasi dasar per jenis tes
  const trainingPrograms = {
    "Push Up": {
      light:
        "Push up 3 set × 8–10 repetisi, 2–3x/minggu. Fokus teknik yang benar.",
      medium:
        "Push up 4 set × 12–15 repetisi, 3x/minggu. Tambah variasi incline/decline.",
      hard:
        "Push up 5 set × 15–20 repetisi, 4–5x/minggu. Tambahkan variasi weighted push up.",
    },
    "Sit Up": {
      light: "Sit up 3 set × 10, 2–3x/minggu. Tambahkan plank 2×20 detik.",
      medium:
        "Sit up 4 set × 12–15, 3x/minggu. Tambah plank 3×30 detik + side plank.",
      hard:
        "Sit up 5 set × 20, 4x/minggu. Tambahkan russian twist 3×15 per sisi.",
    },
    "Skipping": {
      light: "Skipping 5×20 detik, 2–3x/minggu. Fokus koordinasi.",
      medium: "Skipping 6×30 detik, 3–4x/minggu. Tambah variasi single foot.",
      hard:
        "Skipping 8×40 detik, 4–5x/minggu. Tambahkan double under secara bertahap.",
    },
    "Jump Squat": {
      light: "Jump squat 3×8, 2x/minggu. Fokus mendarat lembut.",
      medium: "Jump squat 4×12, 3x/minggu. Bisa ditambah half squat biasa.",
      hard:
        "Jump squat 5×15, 3–4x/minggu. Bisa kombinasikan dengan squat weighted.",
    },
    "Shuttle Run": {
      light: "Lari interval 4×15m, 2x/minggu. Fokus start cepat.",
      medium: "Sprint 6×20m, 3x/minggu. Istirahat 1 menit antar sprint.",
      hard: "Sprint 8×20m, 3–4x/minggu. Tambah agility ladder 3×1 menit.",
    },
    "Yo Yo Test": {
      light:
        "Jogging ringan 10–15 menit, 3x/minggu. Tambahkan interval jalan cepat.",
      medium:
        "Interval running 6×200m, 3x/minggu. Istirahat 1 menit tiap set.",
      hard:
        "Interval 8×200m + fartlek 20 menit, 3–4x/minggu. Fokus peningkatan VO2 max.",
    },
  };

  // Tentukan intensitas berdasarkan gap ke target
  function getRecommendation(test, score, target) {
    const gap = target - score;
    if (gap <= 0) return null; // sudah capai target

    let intensity = "light";
    if (gap > target * 0.3) {
      intensity = "hard"; // jauh banget dari target
    } else if (gap > target * 0.1) {
      intensity = "medium"; // lumayan jauh
    }

    return trainingPrograms[test]?.[intensity] || "Latihan rutin sesuai kemampuan.";
  }

  useEffect(() => {
    getStudentDashboardData().then((data) => {
      const ranked = data.map((s) => {
        const scores = (s.results || []).map((r) => r.score);
        const avg = scores.length
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

        let recommendations = [];
        (s.results || []).forEach((r) => {
          if (r.target) {
            const rec = getRecommendation(
              r.test_type,
              r.score,
              r.target.target_score
            );
            if (rec) {
              recommendations.push(
                `Latihan ${r.test_type}: ${rec} (target ${r.target.target_score}, kamu ${r.score})`
              );
            }
          }
        });

        if (recommendations.length === 0) {
          if ((s.results || []).length === 0) {
            recommendations.push("Belum ada hasil tes 📋");
          } else {
            recommendations.push("Mantap! Semua target tercapai 🎉");
          }
        }

        return { ...s, avgScore: Math.round(avg), recommendations };
      });

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
