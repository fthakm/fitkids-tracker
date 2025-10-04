import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";

export default function StudentForm({ open, onClose, onSave, initialData }) {
  const [student, setStudent] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    parent_name: "",
  });

  useEffect(() => {
    if (initialData) setStudent(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(student);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit Data Siswa" : "Tambah Siswa"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nama"
            value={student.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
          />
          <TextField
            label="Usia"
            type="number"
            value={student.age}
            onChange={(e) => handleChange("age", e.target.value)}
            fullWidth
          />
          <TextField
            label="Gender"
            select
            value={student.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            fullWidth
          >
            <MenuItem value="Laki-laki">Laki-laki</MenuItem>
            <MenuItem value="Perempuan">Perempuan</MenuItem>
          </TextField>
          <TextField
            label="Nomor Telepon"
            value={student.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            fullWidth
          />
          <TextField
            label="Nama Orang Tua"
            value={student.parent_name}
            onChange={(e) => handleChange("parent_name", e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
