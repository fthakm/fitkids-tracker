import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

export default function StudentForm({ onSubmit, onCancel, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    age: initialData.age || "",
    gender: initialData.gender || "",
    phone: initialData.phone || "",
    parent_name: initialData.parent_name || "",
    photo: initialData.photo || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age) {
      alert("Nama dan usia wajib diisi!");
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6" className="font-semibold text-blue-600 mb-2">
        {initialData.id ? "Edit Data Siswa" : "Tambah Siswa Baru"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Nama Siswa"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Usia"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Jenis Kelamin"
          name="gender"
          select
          value={form.gender}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="Laki-laki">Laki-laki</MenuItem>
          <MenuItem value="Perempuan">Perempuan</MenuItem>
        </TextField>
        <TextField
          label="Nomor Telepon"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Nama Orang Tua"
          name="parent_name"
          value={form.parent_name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="URL Foto (Opsional)"
          name="photo"
          value={form.photo}
          onChange={handleChange}
          fullWidth
        />
      </Stack>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}
