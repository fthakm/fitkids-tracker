import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from "@mui/material";

export default function StudentDetail({ open, onClose, student }) {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detail Siswa</DialogTitle>
      <DialogContent>
        <Stack spacing={1} mt={1}>
          <Typography><b>Nama:</b> {student.name}</Typography>
          <Typography><b>Usia:</b> {student.age}</Typography>
          <Typography><b>Gender:</b> {student.gender}</Typography>
          <Typography><b>Telepon:</b> {student.phone}</Typography>
          <Typography><b>Orang Tua:</b> {student.parent_name}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
}
