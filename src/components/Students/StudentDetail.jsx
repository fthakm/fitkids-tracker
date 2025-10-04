import React from "react";
import { Typography, Button, Stack, Avatar } from "@mui/material";

export default function StudentDetail({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="space-y-4">
      <Typography variant="h6" className="font-semibold text-blue-600">
        Detail Siswa
      </Typography>

      <div className="flex items-center gap-4">
        <Avatar
          src={student.photo || "https://via.placeholder.com/80"}
          alt={student.name}
          sx={{ width: 80, height: 80 }}
        />
        <div>
          <Typography variant="h6">{student.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {student.gender}, usia {student.age} tahun
          </Typography>
        </div>
      </div>

      <Stack spacing={1}>
        <Typography><b>Nama Orang Tua:</b> {student.parent_name || "-"}</Typography>
        <Typography><b>Telepon:</b> {student.phone || "-"}</Typography>
        <Typography><b>ID Siswa:</b> {student.id}</Typography>
      </Stack>

      <div className="flex justify-end pt-4">
        <Button variant="contained" color="primary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  );
}
