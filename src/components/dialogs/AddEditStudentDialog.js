import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";
import { addStudent, updateStudent } from "../../services/studentService";

const ageGroups = ["6-8", "9-11", "12-15", "16+"];

export default function AddEditStudentDialog({ open, onClose, student, onSave }) {
  const [form, setForm] = useState({ name: "", birthdate: "", gender: "L", address: "", age_group: ageGroups[0] });

  useEffect(() => {
    if (student) setForm(student);
    else setForm({ name: "", birthdate: "", gender: "L", address: "", age_group: ageGroups[0] });
  }, [student]);

  const handleSubmit = async () => {
    let saved;
    if (student) saved = await updateStudent(student.id, form);
    else saved = await addStudent(form);
    onSave(saved);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <TextField label="Nama" fullWidth margin="dense" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <TextField label="Tanggal Lahir" type="date" fullWidth margin="dense" value={form.birthdate} onChange={e => setForm({ ...form, birthdate: e.target.value })} InputLabelProps={{ shrink: true }} />
        <Select fullWidth margin="dense" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
          <MenuItem value="L">Laki-laki</MenuItem>
          <MenuItem value="P">Perempuan</MenuItem>
        </Select>
        <TextField label="Alamat" fullWidth margin="dense" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <Select fullWidth margin="dense" value={form.age_group} onChange={e => setForm({ ...form, age_group: e.target.value })}>
          {ageGroups.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit}>{student ? "Simpan" : "Tambah"}</Button>
      </DialogActions>
    </Dialog>
  );
  }
