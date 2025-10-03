import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { getTargets } from "../services/studentService";

export default function InputResultsDialog({ open, onClose, student, onSave }) {
  const [targets, setTargets] = useState([]);
  const [form, setForm] = useState({
    test_name: "",
    score: "",
    unit: "",
    remarks: "",
    test_date: "",
  });

  useEffect(() => {
    getTargets().then(setTargets);
  }, []);

  useEffect(() => {
    if (!open) {
      setForm({ test_name: "", score: "", unit: "", remarks: "", test_date: "" });
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({
      student_id: student.id,
      ...form,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Input Hasil Tes untuk {student?.name}</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Jenis Tes"
          name="test_name"
          value={form.test_name}
          onChange={handleChange}
        >
          {targets.map((t) => (
            <MenuItem key={t.test_name} value={t.test_name}>
              {t.test_name} (Target {t.min_score})
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth margin="dense" label="Nilai" type="number" name="score" value={form.score} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Satuan (opsional)" name="unit" value={form.unit} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Catatan" name="remarks" value={form.remarks} onChange={handleChange} />
        <TextField
          fullWidth
          margin="dense"
          label="Tanggal Tes"
          type="date"
          name="test_date"
          value={form.test_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
            }
