import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Divider
} from "@mui/material";
import { getResultsByStudent } from "../services/studentService";

export default function StudentDialog({ open, onClose, student }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (student?.id) {
      getResultsByStudent(student.id).then(setResults).catch(console.error);
    }
  }, [student]);

  // Badge logic sederhana (bisa dikembangin sesuai target)
  const getBadges = () => {
    if (!results.length) return [];
    const badges = [];
    if (results.length >= 5) badges.push("Rajin Latihan 💪");
    if (results.some(r => r.score >= 90)) badges.push("High Achiever 🏆");
    if (results.every(r => r.score >= 70)) badges.push("Konsisten ⭐");
    return badges;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detail Siswa: {student?.name}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1">Umur: {student?.age}</Typography>
        <Typography variant="subtitle1">Kelas: {student?.class_name}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Hasil Tes</Typography>
        {results.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Belum ada hasil tes.
          </Typography>
        ) : (
          <List>
            {results.map((r, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={`${r.test_name} - ${r.score} ${r.unit || ""}`}
                  secondary={`${r.test_date} | Catatan: ${r.remarks || "-"}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Badges</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {getBadges().length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Belum ada badge.
            </Typography>
          ) : (
            getBadges().map((b, idx) => <Chip key={idx} label={b} color="primary" />)
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
                                }
