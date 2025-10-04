import React from "react";
import { Typography, Button, Divider } from "@mui/material";

export default function StudentDetail({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="space-y-4">
      <Typography variant="h6" className="text-blue-600 font-semibold">
        Detail Siswa
      </Typography>
      <Divider />

      <div className="space-y-2">
        <p><strong>Nama:</strong> {student.name}</p>
        <p><strong>Usia:</strong> {student.age}</p>
        <p><strong>Jenis Kelamin:</strong> {student.gender}</p>
        <p><strong>Nama Orang Tua:</strong> {student.parent_name || "-"}</p>
        <p><strong>No. Telepon:</strong> {student.phone || "-"}</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose} variant="contained" color="primary">
          Tutup
        </Button>
      </div>
    </div>
  );
}
