import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem
} from "@mui/material";
import { saveResults } from "../services/evaluationService";
import { getStudents } from "../services/studentService";

export default function InputResultsDialog({ open, onClose, defaultStudentId }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_id: defaultStudentId || "", score: "", attendance: 0, month: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStudents().then(setStudents).catch(e => console.error(e));
  }, []);

  useEffect(() => {
    setForm(prev => ({ ...prev, student_id: defaultStudentId || prev.student_id }));
  }, [defaultStudentId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // expect saveResults(service) to accept object with student_id, score, attendance, month
      await saveResults(form.student_id, { score: parseInt(form.score || 0, 10), attendance: parseInt(form.attendance || 0, 10), month: form.month });
      onClose(true);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan hasil: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Input Hasil Latihan</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField select label="Siswa" value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})}>
            {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
          <TextField label="Skor" value={form.score} onChange={e => setForm({...form, score: e.target.value})} type="number" />
          <TextField label="Kehadiran" value={form.attendance} onChange={e => setForm({...form, attendance: e.target.value})} type="number" />
          <TextField label="Bulan" value={form.month} onChange={e => setForm({...form, month: e.target.value})} placeholder="e.g. 2025-10" />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Batal</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
      </DialogActions>
    </Dialog>
  );
  }
  
