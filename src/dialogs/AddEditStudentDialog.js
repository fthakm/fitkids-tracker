import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, DialogActions, Button } from "@mui/material";
import { validateStudent } from "../utils/validation";

export default function AddEditStudentDialog({ open, onClose, students, setStudents, student, showSnackbar }) {
  const [form, setForm] = useState({ name: "", age: "6-8", address: "", gender: "" });

  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  const handleSave = () => {
    const error = validateStudent(form);
    if (error) {
      showSnackbar(error, "error");
      return;
    }

    if (student) {
      setStudents(students.map(s => s.id === student.id ? form : s));
      showSnackbar("Data siswa diperbarui");
    } else {
      setStudents([...students, { ...form, id: Date.now(), results: [], badge: "" }]);
      showSnackbar("Siswa ditambahkan");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nama"
          fullWidth
          margin="dense"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <Select fullWidth value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} sx={{ mt: 1 }}>
          <MenuItem value="6-8">6-8</MenuItem>
          <MenuItem value="9-11">9-11</MenuItem>
          <MenuItem value="12-15">12-15</MenuItem>
          <MenuItem value="16+">16+</MenuItem>
        </Select>
        <TextField
          label="Tempat Tinggal"
          fullWidth
          margin="dense"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <Select fullWidth value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} sx={{ mt: 1 }}>
          <MenuItem value="">Pilih Jenis Kelamin</MenuItem>
          <MenuItem value="Laki-laki">Laki-laki</MenuItem>
          <MenuItem value="Perempuan">Perempuan</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSave}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
            }
