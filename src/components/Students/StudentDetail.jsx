import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function StudentDetail({ student }) {
  if (!student) return (<Paper sx={{ p:3 }}><Typography>Belum ada siswa dipilih</Typography></Paper>);
  return (
    <Paper sx={{ p:3 }}>
      <Typography variant='h6'>Detail Siswa</Typography>
      <Box mt={2}>
        <Typography><strong>Nama:</strong> {student.name || '-'}</Typography>
        <Typography><strong>Usia:</strong> {student.age || '-'}</Typography>
        <Typography><strong>Telepon:</strong> {student.phone || '-'}</Typography>
      </Box>
    </Paper>
  );
}
