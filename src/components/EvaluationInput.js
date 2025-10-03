import React, { useState } from "react";
import { Paper, Typography, TextField, Grid, Button } from "@mui/material";
import { getCriteriaByAge, evaluateScore } from "../utils/evaluationHelpers";

export default function EvaluationInput({ student, onSubmit }) {
  const [scores, setScores] = useState({});

  if (!student) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Pilih siswa untuk input evaluasi</Typography>
      </Paper>
    );
  }

  const criteria = getCriteriaByAge(student.age);

  const handleChange = (test, value) => {
    setScores({ ...scores, [test]: value });
  };

  const handleSubmit = () => {
    const results = criteria.map((c) => {
      const score = parseFloat(scores[c.test]) || 0;
      const result = evaluateScore(c.test, score, student.age);
      return { test: c.test, score, result };
    });
    onSubmit({ studentId: student.id, studentName: student.name, results });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Input Evaluasi untuk {student.name}</Typography>
      <Grid container spacing={2} mt={2}>
        {criteria.map((c, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <TextField
              label={c.test}
              fullWidth
              value={scores[c.test] || ""}
              onChange={(e) => handleChange(c.test, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Simpan Hasil
      </Button>
    </Paper>
  );
    }
