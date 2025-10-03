import React, { useEffect, useState } from "react";
import { 
  Box, AppBar, Toolbar, Typography, Tabs, Tab, 
  Container, Paper, Button, Snackbar, Alert, 
  Select, MenuItem
} from "@mui/material";
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

export default function App() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openInput, setOpenInput] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [filterAge, setFilterAge] = useState("");

  // 🆕 State untuk StudentDialog
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

  // 🆕 Handler untuk buka StudentDialog
  const handleOpenStudentDialog = (student) => {
    setDetailStudent(student);
    setOpenStudentDialog(true);
  };

  const filteredStudents = filterAge ? students.filter(s => s.age === filterAge) : students;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fa" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>FitKids Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
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
              // 🆕 Tambahin prop untuk lihat detail
              onView={handleOpenStudentDialog}
            />
          </Box>
        )}
        {tab === 2 && <Leaderboard students={students} />}

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

        {/* 🆕 StudentDialog */}
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
      </Container>
    </Box>
  );
              }
