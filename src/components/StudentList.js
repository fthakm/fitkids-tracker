import React from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Paper, TableContainer
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function StudentList({ students, onEdit, onDelete, onInput }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>Usia</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.length > 0 ? (
            students.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s?.name || "-"}</TableCell>
                <TableCell>{s?.age || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(s)}><EditIcon /></IconButton>
                  <IconButton onClick={() => onDelete(s.id)}><DeleteIcon /></IconButton>
                  <IconButton onClick={() => onInput(s)}><AddIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>Belum ada siswa</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
                         }
