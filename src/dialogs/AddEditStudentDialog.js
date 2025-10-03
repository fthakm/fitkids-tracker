import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { uploadStudentPhoto } from "../services/uploadService";

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

  const [photoFile, setPhotoFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

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
      setPhotoFile(null);
    }
  }, [student]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0] || null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setSnackbar({ open: true, message: "Nama siswa wajib diisi", severity: "error" });
      return;
    }
    if (!form.birthDate) {
      setSnackbar({ open: true, message: "Tanggal lahir wajib diisi", severity: "error" });
      return;
    }
    if (!form.gender) {
      setSnackbar({ open: true, message: "Jenis kelamin wajib dipilih", severity: "error" });
      return;
    }
    if (form.phone && !/^[0-9]+$/.test(form.phone)) {
      setSnackbar({ open: true, message: "Nomor HP hanya boleh berisi angka", severity: "error" });
      return;
    }

    try {
      let photoUrl = form.photoUrl;
      if (photoFile) {
        photoUrl = await uploadStudentPhoto(photoFile);
      }

      onSave({ ...form, photoUrl }, !!student);
    } catch (err) {
      setSnackbar({ open: true, message: "Gagal upload foto", severity: "error" });
    }
  };

  return (
    <>
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

          {/* Upload file */}
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload Foto
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {form.photoUrl && (
            <div style={{ marginTop: 10 }}>
              <img src={form.photoUrl} alt="Foto siswa" width="100" style={{ borderRadius: 8 }} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">Simpan</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
            }
