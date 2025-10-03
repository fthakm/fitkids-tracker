import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function InputResultsDialog({ open, onClose, student, onSave }) {
  const [results, setResults] = useState({ score: "" });

  useEffect(() => {
    setResults({ score: "" });
  }, [student]);

  const handleChange = (e) => {
    setResults({ ...results, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!student) return;
    onSave({ ...results, student_id: student.id });
  };

  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Input Hasil untuk {student?.name || "Siswa"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Skor"
          name="score"
          value={results.score}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
            }
