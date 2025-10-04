import React from "react";
import { Paper, Typography, Divider, Box, Button } from "@mui/material";

export default function StudentDetail({ student, onClose }) {
  if (!student) return null;

  return (
    <Paper className="p-6 md:p-8 rounded-xl shadow-md bg-white">
      <Typography variant="h6" className="font-semibold text-blue-600 mb-2">
        Detail Siswa
      </Typography>
      <Divider className="mb-4" />

      <Box className="flex flex-col md:flex-row items-start gap-6">
        {student.photo && (
          <img
            src={student.photo}
            alt={student.name}
            className="w-32 h-32 object-cover rounded-lg border"
          />
        )}

        <div className="space-y-2">
          <Typography variant="body1">
            <b>Nama:</b> {student.name}
          </Typography>
          <Typography variant="body1">
            <b>Usia:</b> {student.age} tahun
          </Typography>
          <Typography variant="body1">
            <b>Gender:</b> {student.gender}
          </Typography>
          <Typography variant="body1">
            <b>Telepon:</b> {student.phone || "-"}
          </Typography>
          <Typography variant="body1">
            <b>Orang Tua:</b> {student.parentName || "-"}
          </Typography>
        </div>
      </Box>

      <div className="flex justify-end mt-6">
        <Button onClick={onClose} variant="outlined" color="primary">
          Tutup
        </Button>
      </div>
    </Paper>
  );
}
