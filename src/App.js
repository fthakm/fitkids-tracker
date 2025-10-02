// src/App.js
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Box, Paper, Snackbar, Alert, Select, MenuItem } from "@mui/material";

import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import StudentList from "./components/StudentList";

import AddEditStudentDialog from "./dialogs/AddEditStudentDialog";
import InputResultsDialog from "./dialogs/InputResultsDialog";

import { getStudents, saveStudent, deleteStudent, saveResults } from "./services/studentService";

const ageGroups = ["6-8", "9-11", "12-15", "16+"];

export default function App() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [filterAge, setFilterAge] = useState(ageGroups[0]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [openInputResults, setOpenInputResults] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetch = async () => {
      const data = await getStudents();
      setStudents(data);
    };
    fetch();
  }, []);

  const handleAddEditStudent = async (student, isEdit) => {
    await saveStudent(student, isEdit);
    const data = await getStudents();
    setStudents(data);
    setSnackbar({ open: true, message: isEdit ? "Data siswa diperbarui" : "Siswa ditambahkan", severity: "success" });
    setOpenAddEdit(false);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Yakin ingin menghapus siswa ini?")) return;
    await deleteStudent(id);
    const data = await getStudents();
    setStudents(data);
    setSnackbar({ open: true, message: "Siswa dihapus", severity: "success" });
  };

  const handleSaveResults = async (studentId, results) => {
    await saveResults(studentId, results);
    const data = await getStudents();
    setStudents(data);
    setSnackbar({ open: true, message: "Hasil latihan tersimpan", severity: "success" });
    setOpenInputResults(false);
  };

  return (
    <Box sx={{ bgcolor: "#f7f9fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            FitKids Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={2}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Dashboard" />
            <Tab label="Siswa" />
            <Tab label="Leaderboard" />
          </Tabs>
        </Paper>

        {tab === 0 && <Dashboard students={students} />}
        {tab === 1 && (
          <StudentList
            students={students}
            filterAge={filterAge}
            setFilterAge={setFilterAge}
            onAdd={() => setOpenAddEdit(true)}
            onEdit={(s) => { setSelectedStudent(s); setOpenAddEdit(true); }}
            onDelete={handleDeleteStudent}
            onInputResults={(s) => { setSelectedStudent(s); setOpenInputResults(true); }}
          />
        )}
        {tab === 2 && <Leaderboard students={students} />}

        <AddEditStudentDialog
          open={openAddEdit}
          onClose={() => setOpenAddEdit(false)}
          onSave={handleAddEditStudent}
          student={selectedStudent}
        />

        <InputResultsDialog
          open={openInputResults}
          onClose={() => setOpenInputResults(false)}
          student={selectedStudent}
          onSave={handleSaveResults}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
  }
