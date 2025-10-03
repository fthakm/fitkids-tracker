import React, { useEffect, useState } from "react";
import {
  Box, AppBar, Toolbar, Typography, Container, Paper, Button,
  Snackbar, Alert, Select, MenuItem, Drawer, List, ListItem, ListItemText, ListItemIcon
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";

import {
  getStudents, saveStudent, updateStudent,
  deleteStudent, saveResult
} from "./services/studentService";

import AddEditStudentDialog from "./dialogs/AddEditStudentDialog";
import InputResultsDialog from "./dialogs/InputResultsDialog";
import StudentList from "./components/StudentList";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import StudentDialog from "./components/StudentDialog";
import EvaluationsPage from "./pages/EvaluationsPage";

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

const drawerWidth = 220;

function AppContent() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openInput, setOpenInput] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [filterAge, setFilterAge] = useState("");

  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Gagal memuat siswa", severity: "error" });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddEditStudent = async (student, isEdit) => {
    try {
      if (isEdit) {
        if (!student.id && editingStudent?.id) {
          student.id = editingStudent.id;
        }
        await updateStudent(student.id, student);
        setSnackbar({ open: true, message: "Siswa diperbarui", severity: "success" });
      } else {
        await saveStudent(student);
        setSnackbar({ open: true, message: "Siswa ditambahkan", severity: "success" });
      }
      setOpenAddEdit(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Gagal menyimpan siswa", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      await deleteStudent(id);
      setSnackbar({ open: true, message: "Siswa dihapus", severity: "success" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Gagal menghapus siswa", severity: "error" });
    }
  };

  const handleOpenInput = (student) => {
    setSelectedStudent(student);
    setOpenInput(true);
  };

  const handleSaveResults = async (result) => {
    try {
      await saveResult(result);
      setSnackbar({ open: true, message: "Hasil penilaian tersimpan", severity: "success" });
      setOpenInput(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Gagal menyimpan hasil penilaian", severity: "error" });
    }
  };

  const handleOpenStudentDialog = (student) => {
    setDetailStudent(student);
    setOpenStudentDialog(true);
  };

  const filteredStudents = filterAge ? students.filter(s => s.age === filterAge) : students;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar>
          <Typography variant="h6">FitKids</Typography>
        </Toolbar>
        <List>
          <ListItem button onClick={() => navigate("/dashboard")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => navigate("/siswa")}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Siswa" />
          </ListItem>
          <ListItem button onClick={() => navigate("/leaderboard")}>
            <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
            <ListItemText primary="Leaderboard" />
          </ListItem>
          <ListItem button onClick={() => navigate("/evaluasi")}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Evaluasi" />
          </ListItem>
        </List>
      </Drawer>

      {/* Konten utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ ml: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              FitKids Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />

        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard students={students} />} />

              <Route
                path="/siswa"
                element={
                  <Box mt={3}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Select value={filterAge} onChange={e => setFilterAge(e.target.value)} displayEmpty>
                        <MenuItem value="">Semua Usia</MenuItem>
                        <MenuItem value="6-8">6-8</MenuItem>
                        <MenuItem value="9-11">9-11</MenuItem>
                        <MenuItem value="12-15">12-15</MenuItem>
                        <MenuItem value="16+">16+</MenuItem>
                      </Select>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => { setEditingStudent(null); setOpenAddEdit(true); }}
                      >
                        Tambah Siswa
                      </Button>
                    </Box>
                    <StudentList
                      students={filteredStudents}
                      onEdit={student => { setEditingStudent(student); setOpenAddEdit(true); }}
                      onDelete={handleDelete}
                      onInput={handleOpenInput}
                      onView={handleOpenStudentDialog}
                    />
                  </Box>
                }
              />

              <Route path="/leaderboard" element={<Leaderboard students={students} />} />
              <Route path="/evaluasi" element={<EvaluationsPage />} />

              {/* Redirect default */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Paper>
        </Container>
      </Box>

      {/* Dialogs */}
      <AddEditStudentDialog
        open={openAddEdit}
        onClose={() => setOpenAddEdit(false)}
        onSave={handleAddEditStudent}
        student={editingStudent}
      />
      <InputResultsDialog
        open={openInput}
        onClose={() => setOpenInput(false)}
        student={selectedStudent}
        onSave={handleSaveResults}
      />
      <StudentDialog
        open={openStudentDialog}
        onClose={() => setOpenStudentDialog(false)}
        student={detailStudent}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
        }
