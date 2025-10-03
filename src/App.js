import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  getStudents,
  saveStudent,
  updateStudent,
  deleteStudent,
  saveResult,
} from "./services/studentService";

import AddEditStudentDialog from "./dialogs/AddEditStudentDialog";
import InputResultsDialog from "./dialogs/InputResultsDialog";
import StudentList from "./components/StudentList";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import StudentDialog from "./components/StudentDialog";
import EvaluationsPage from "./pages/EvaluationsPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

// --- Tab navigation ---
const tabMap = ["/dashboard", "/siswa", "/leaderboard", "/evaluasi"];
const tabLabels = ["Dashboard", "Siswa", "Leaderboard", "Evaluasi"];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [students, setStudents] = useState([]);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openInput, setOpenInput] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filterAge, setFilterAge] = useState("");

  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [detailStudent, setDetailStudent] = useState(null);

  // --- Fetch students ---
  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal memuat siswa",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // --- CRUD Siswa ---
  const handleAddEditStudent = async (student, isEdit) => {
    try {
      if (isEdit) {
        if (!student.id && editingStudent?.id) {
          student.id = editingStudent.id;
        }
        await updateStudent(student.id, student);
        setSnackbar({
          open: true,
          message: "Siswa diperbarui",
          severity: "success",
        });
      } else {
        await saveStudent(student);
        setSnackbar({
          open: true,
          message: "Siswa ditambahkan",
          severity: "success",
        });
      }
      setOpenAddEdit(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal menyimpan siswa",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus siswa ini?")) return;
    try {
      await deleteStudent(id);
      setSnackbar({
        open: true,
        message: "Siswa dihapus",
        severity: "success",
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal menghapus siswa",
        severity: "error",
      });
    }
  };

  // --- Input hasil ---
  const handleOpenInput = (student) => {
    setSelectedStudent(student);
    setOpenInput(true);
  };

  const handleSaveResults = async (result) => {
    try {
      await saveResult(result);
      setSnackbar({
        open: true,
        message: "Hasil penilaian tersimpan",
        severity: "success",
      });
      setOpenInput(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Gagal menyimpan hasil penilaian",
        severity: "error",
      });
    }
  };

  // --- Detail siswa ---
  const handleOpenStudentDialog = (student) => {
    setDetailStudent(student);
    setOpenStudentDialog(true);
  };

  // --- Filter siswa ---
  const filteredStudents = filterAge
    ? students.filter((s) => s.age === filterAge)
    : students;

  // --- Tab Navigation sync ---
  const currentTab = tabMap.indexOf(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* TOP NAV */}
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            FitKids Tracker
          </Typography>
          <Tabs
            value={currentTab === -1 ? 0 : currentTab}
            onChange={(_, newValue) => navigate(tabMap[newValue])}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ marginLeft: 4 }}
          >
            {tabLabels.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Spacer biar konten ga ketutup AppBar */}
      <Toolbar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 3, mb: 4 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard students={students} />} />

            <Route
              path="/siswa"
              element={
                <Box mt={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Select
                      value={filterAge}
                      onChange={(e) => setFilterAge(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 140 }}
                    >
                      <MenuItem value="">Semua Usia</MenuItem>
                      <MenuItem value="6-8">6-8</MenuItem>
                      <MenuItem value="9-11">9-11</MenuItem>
                      <MenuItem value="12-15">12-15</MenuItem>
                      <MenuItem value="16+">16+</MenuItem>
                    </Select>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setEditingStudent(null);
                        setOpenAddEdit(true);
                      }}
                    >
                      Tambah Siswa
                    </Button>
                  </Box>
                  <StudentList
                    students={filteredStudents}
                    onEdit={(student) => {
                      setEditingStudent(student);
                      setOpenAddEdit(true);
                    }}
                    onDelete={handleDelete}
                    onInput={handleOpenInput}
                    onView={handleOpenStudentDialog}
                  />
                </Box>
              }
            />

            <Route
              path="/leaderboard"
              element={<Leaderboard students={students} />}
            />
            <Route path="/evaluasi" element={<EvaluationsPage />} />

            {/* Redirect default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Paper>
      </Container>

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

      {/* Snackbar */}
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
