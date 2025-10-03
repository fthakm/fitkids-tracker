// src/dialogs/InputResultsDialog.js
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { getTargets } from "../services/studentService";

export default function InputResultsDialog({ open, onClose, student, onSave }) {
  const [targets, setTargets] = useState([]);
  const [form, setForm] = useState({ test_name: "", score: "" });

  useEffect(() => {
    if (open) {
      getTargets().then(setTargets).catch(console.error);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.test_name || !form.score) return;
    onSave({
      student_id: student.id,
      test_name: form.test_name,
      score: Number(form.score),
    });
    setForm({ test_name: "", score: "" });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Input Hasil Penilaian</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Jenis Tes"
          name="test_name"
          value={form.test_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {targets.map((t) => (
            <MenuItem key={t.id} value={t.test_name}>
              {t.test_name} (Target: {t.min_score})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Nilai"
          name="score"
          type="number"
          value={form.score}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
                       }
