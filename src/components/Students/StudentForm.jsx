import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function StudentForm({ onSubmit, initialData = {}, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    age: initialData.age || "",
    gender: initialData.gender || "",
    phone: initialData.phone || "",
    parentName: initialData.parentName || "",
    photo: initialData.photo || null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper className="p-6 md:p-8 rounded-xl shadow-md bg-white">
      <Typography variant="h6" className="font-semibold text-blue-600 mb-4">
        {initialData.id ? "Edit Data Siswa" : "Tambah Siswa Baru"}
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Nama Lengkap"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Usia"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Gender"
            name="gender"
            select
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="Laki-laki">Laki-laki</MenuItem>
            <MenuItem value="Perempuan">Perempuan</MenuItem>
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Telepon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Nama Orang Tua"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <Box className="flex items-center gap-3">
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ textTransform: "none" }}
          >
            Upload Foto
            <input
              hidden
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
          {formData.photo && (
            <Typography variant="body2" color="textSecondary">
              {formData.photo.name || "Foto sudah dipilih"}
            </Typography>
          )}
        </Box>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} color="inherit" variant="outlined">
            Batal
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Simpan
          </Button>
        </div>
      </form>
    </Paper>
  );
}
