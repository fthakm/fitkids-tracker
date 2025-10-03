import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

export default function AddEditStudentDialog({ open, onClose, onSave, student }) {
  const [form, setForm] = useState({ name: "", age: "" });

  useEffect(() => {
    if (student) {
      setForm({ name: student.name || "", age: student.age || "" });
    } else {
      setForm({ name: "", age: "" });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave({ ...student, ...form }, !!student);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nama"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Usia"
          name="age"
          value={form.age}
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
