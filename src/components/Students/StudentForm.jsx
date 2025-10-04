import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography } from "@mui/material";

export default function StudentForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    age: initialData.age || "",
    gender: initialData.gender || "",
    phone: initialData.phone || "",
    parent_name: initialData.parent_name || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <Typography variant="h6" className="text-blue-600 font-semibold">
        {initialData.id ? "Edit Data Siswa" : "Tambah Siswa"}
      </Typography>

      <TextField
        label="Nama Lengkap"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Usia"
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Jenis Kelamin"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        select
        fullWidth
      >
        <MenuItem value="Laki-laki">Laki-laki</MenuItem>
        <MenuItem value="Perempuan">Perempuan</MenuItem>
      </TextField>
      <TextField
        label="Nama Orang Tua"
        name="parent_name"
        value={formData.parent_name}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Nomor Telepon"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
      />

      <div className="flex justify-end gap-3 mt-4">
        <Button onClick={onCancel} variant="outlined" color="inherit">
          Batal
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Simpan
        </Button>
      </div>
    </form>
  );
}
