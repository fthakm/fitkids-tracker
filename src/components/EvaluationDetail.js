import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function EvaluationDetail({ evaluation }) {
  if (!evaluation) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Belum ada evaluasi dipilih</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Detail Evaluasi</Typography>
      <Box mt={2}>
        <Typography><strong>Tanggal:</strong> {evaluation.date}</Typography>
        <Typography><strong>Siswa:</strong> {evaluation.studentName}</Typography>
      </Box>
      <Box mt={2}>
        {evaluation.results?.map((res, idx) => (
          <Typography key={idx}>
            <strong>{res.test}:</strong> {res.score} → {res.result}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
    }
