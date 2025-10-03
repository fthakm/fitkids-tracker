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
import { getTargetsByStudent } from "../services/studentService";

export default function InputResultsDialog({ open, onClose, student, onSave }) {
  const [targets, setTargets] = useState([]);
  const [form, setForm] = useState({
    test_name: "",
    score: "",
    unit: "",
    remarks: "",
    test_date: "",
  });

  // 🔹 Ambil target sesuai umur siswa
  useEffect(() => {
    if (student?.id) {
      getTargetsByStudent(student.id).then((data) => {
        setTargets(data || []);
      });
    }
  }, [student]);

  // 🔹 Reset form setiap kali dialog ditutup atau ganti siswa
  useEffect(() => {
    if (!open) {
      setForm({
        test_name: "",
        score: "",
        unit: "",
        remarks: "",
        test_date: "",
      });
      setTargets([]);
    }
  }, [open, student]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // kalau pilih test_name → auto isi unit dari target
    if (name === "test_name") {
      const selected = targets.find((t) => t.test_name === value);
      setForm((prev) => ({
        ...prev,
        test_name: value,
        unit: selected?.unit || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.test_name || !form.score) {
      alert("Harap isi jenis tes dan nilai!");
      return;
    }

    onSave({
      student_id: student.id,
      ...form,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Input Hasil Tes untuk {student?.name}</DialogTitle>
      <DialogContent dividers>
        {/* Pilihan jenis tes sesuai umur */}
        <TextField
          select
          fullWidth
          margin="dense"
          label="Jenis Tes"
          name="test_name"
          value={form.test_name}
          onChange={handleChange}
        >
          {targets.length === 0 ? (
            <MenuItem disabled>Tidak ada target untuk umur ini</MenuItem>
          ) : (
            targets.map((t) => (
              <MenuItem key={t.test_name} value={t.test_name}>
                {t.test_name} (Target {t.min_score} {t.unit || ""})
              </MenuItem>
            ))
          )}
        </TextField>

        {/* Nilai */}
        <TextField
          fullWidth
          margin="dense"
          label="Nilai"
          type="number"
          name="score"
          value={form.score}
          onChange={handleChange}
        />

        {/* Unit (auto-set dari target tapi bisa diedit manual) */}
        <TextField
          fullWidth
          margin="dense"
          label="Satuan"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="contoh: kali, detik, cm"
        />

        {/* Catatan */}
        <TextField
          fullWidth
          margin="dense"
          label="Catatan"
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
        />

        {/* Tanggal Tes */}
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
        <Button onClick={handleSubmit} variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
