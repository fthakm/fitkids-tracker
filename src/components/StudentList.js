import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function StudentList({ students, onEdit, onDelete, onInput, onView }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>Usia</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Telepon</TableCell>
            <TableCell>Orang Tua</TableCell>
            <TableCell align="center">Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Belum ada data siswa
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.parent_name || student.parentName}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Lihat Detail">
                    <IconButton onClick={() => onView(student)} color="info">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(student)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Input Hasil Tes">
                    <IconButton onClick={() => onInput(student)} color="secondary">
                      <AssignmentIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <IconButton onClick={() => onDelete(student.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
            }
