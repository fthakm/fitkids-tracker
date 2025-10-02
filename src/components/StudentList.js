import React, { useState, useEffect } from "react";
import { Box, Button, Select, MenuItem, Paper, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddEditStudentDialog from "./dialogs/AddEditStudentDialog";
import { fetchStudents, deleteStudent } from "../services/studentService";

const ageGroups = ["6-8", "9-11", "12-15", "16+"];

export default function StudentList({ onSelectStudent }) {
  const [students, setStudents] = useState([]);
  const [filterAge, setFilterAge] = useState(ageGroups[0]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  useEffect(() => { fetchStudents().then(setStudents); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus siswa ini?")) {
      await deleteStudent(id);
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSave = (updated) => {
    const exists = students.find(s => s.id === updated.id);
    if (exists) {
      setStudents(students.map(s => s.id === updated.id ? updated : s));
    } else {
      setStudents([...students, updated]);
    }
    setOpenDialog(false);
  };

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Daftar Siswa</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>Tambah Siswa</Button>
      </Box>
      <Box mb={2}>
        <Select value={filterAge} onChange={e => setFilterAge(e.target.value)}>
          {ageGroups.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </Select>
      </Box>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <DataGrid
          rows={students.filter(s => s.age_group === filterAge)}
          columns={[
            { field: "name", headerName: "Nama", flex: 1 },
            { field: "age_group", headerName: "Usia", width: 100 },
            { field: "gender", headerName: "JK", width: 80 },
            { field: "address", headerName: "Alamat", flex: 1 },
            { field: "action", headerName: "Aksi", width: 180, renderCell: (params) => (
              <>
                <IconButton color="primary" onClick={() => onSelectStudent(params.row)}><VisibilityIcon /></IconButton>
                <IconButton color="info" onClick={() => { setEditStudent(params.row); setOpenDialog(true); }}><EditIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
              </>
            )}
          ]}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Paper>
      <AddEditStudentDialog open={openDialog} onClose={() => { setOpenDialog(false); setEditStudent(null); }} student={editStudent} onSave={handleSave} />
    </Box>
  );
}
