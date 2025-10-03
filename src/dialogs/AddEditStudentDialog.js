import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";

export default function AddEditStudentDialog({ open, onClose, onSave, student }) {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    address: "",
    gender: "",
  });

  useEffect(() => {
    if (student) {
      setForm(student);
    } else {
      setForm({ name: "", birthDate: "", address: "", gender: "" });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.birthDate || !form.gender) {
      alert("Harap isi semua data penting");
      return;
    }
    onSave(form, !!student);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nama Lengkap"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          type="date"
          label="Tanggal Lahir"
          name="birthDate"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.birthDate}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Tempat Tinggal"
          name="address"
          fullWidth
          value={form.address}
          onChange={handleChange}
        />
        <TextField
          select
          margin="dense"
          label="Jenis Kelamin"
          name="gender"
          fullWidth
          value={form.gender}
          onChange={handleChange}
        >
          <MenuItem value="Laki-laki">Laki-laki</MenuItem>
          <MenuItem value="Perempuan">Perempuan</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
