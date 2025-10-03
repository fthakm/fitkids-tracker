import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // ganti Edit
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function StudentList({ students, onEdit, onDelete, onInput, onView }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflowX: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><Typography fontWeight="bold">Nama</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Usia</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Gender</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Telepon</Typography></TableCell>
            <TableCell><Typography fontWeight="bold">Orang Tua</Typography></TableCell>
            <TableCell align="center"><Typography fontWeight="bold">Aksi</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body2" color="text.secondary">
                  Belum ada data siswa
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow
                key={student.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? "action.hover" : "inherit",
                }}
              >
                <TableCell>
                  <Typography fontWeight="600" noWrap>
                    {student.name}
                  </Typography>
                </TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell sx={{ maxWidth: 120, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {student.phone}
                </TableCell>
                <TableCell sx={{ maxWidth: 140, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {student.parent_name || student.parentName}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Lihat Detail">
                    <IconButton onClick={() => onView(student)} color="info">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Data Siswa">
                    <IconButton onClick={() => onEdit(student)} color="primary">
                      <ManageAccountsIcon />
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
