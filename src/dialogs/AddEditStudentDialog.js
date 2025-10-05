import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack
} from "@mui/material";
import { addStudent, updateStudent } from "../services/studentService";

export default function AddEditStudentDialog({ open, onClose, student }) {
  const [form, setForm] = useState({ name: "", birth_date: "", phone: "", parent_name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        birth_date: student.birth_date || student.birthDate || "",
        phone: student.phone || "",
        parent_name: student.parent_name || student.parentName || ""
      });
    } else {
      setForm({ name: "", birth_date: "", phone: "", parent_name: "" });
    }
  }, [student, open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (student && student.id) {
        await updateStudent(student.id, form);
      } else {
        await addStudent(form);
      }
      onClose(true);
    } catch (e) {
      console.error("Save student error", e);
      alert("Gagal menyimpan siswa: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField label="Nama" value={form.name} onChange={e => setForm({...form, name: e.target.value})} fullWidth />
          <TextField label="Tanggal Lahir" type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Telepon" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} fullWidth />
          <TextField label="Nama Orang Tua" value={form.parent_name} onChange={e => setForm({...form, parent_name: e.target.value})} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Batal</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
      </DialogActions>
    </Dialog>
  );
  }
  
