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

export default function AddEditStudentDialog({ open, onClose, onSave, student }) {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    birthPlace: "",
    address: "",
    gender: "",
    phone: "",
    parentName: "",
    parentContact: "",
    photoUrl: "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        birthDate: student.birthDate || student.birth_date || "",
        birthPlace: student.birthPlace || student.birth_place || "",
        address: student.address || "",
        gender: student.gender || "",
        phone: student.phone || "",
        parentName: student.parentName || student.parent_name || "",
        parentContact: student.parentContact || student.parent_contact || "",
        photoUrl: student.photoUrl || student.photo_url || "",
      });
    } else {
      setForm({
        name: "",
        birthDate: "",
        birthPlace: "",
        address: "",
        gender: "",
        phone: "",
        parentName: "",
        parentContact: "",
        photoUrl: "",
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form, !!student);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{student ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent dividers>
        <TextField fullWidth margin="dense" label="Nama" name="name" value={form.name} onChange={handleChange} />
        <TextField
          fullWidth
          margin="dense"
          label="Tanggal Lahir"
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField fullWidth margin="dense" label="Tempat Lahir" name="birthPlace" value={form.birthPlace} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Alamat" name="address" value={form.address} onChange={handleChange} />
        <TextField
          select
          fullWidth
          margin="dense"
          label="Jenis Kelamin"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <MenuItem value="Laki-laki">Laki-laki</MenuItem>
          <MenuItem value="Perempuan">Perempuan</MenuItem>
        </TextField>
        <TextField fullWidth margin="dense" label="Nomor HP" name="phone" value={form.phone} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Nama Orang Tua" name="parentName" value={form.parentName} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Kontak Orang Tua" name="parentContact" value={form.parentContact} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="URL Foto" name="photoUrl" value={form.photoUrl} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
