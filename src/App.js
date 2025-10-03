import React, { useEffect, useState, useMemo } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

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
import { getAgeGroup } from "./utils/evaluationHelpers";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

// --- Menu navigasi ---
const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Siswa", path: "/siswa", icon: <PeopleIcon /> },
  { label: "Leaderboard", path: "/leaderboard", icon: <EmojiEventsIcon /> },
  { label: "Evaluasi", path: "/evaluasi", icon: <AssessmentIcon /> },
];

const drawerWidth = 220;

function AppContent({ toggleTheme, darkMode }) {
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

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
    ? students.filter((s) => getAgeGroup(s.age) === filterAge)
    : students;

  // --- Sidebar Drawer ---
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          FitKids
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: "#fff" },
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={toggleTheme}
          startIcon={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* TOPBAR */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: "bold" }}>
            FitKids Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 2, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              p: 3,
              background: darkMode
                ? "linear-gradient(180deg, #121212, #1e1e1e)"
                : "linear-gradient(180deg, #fff, #f9f9f9)",
            }}
          >
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
                        sx={{ minWidth: 160 }}
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
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#ff9800",
          },
        },
        shape: { borderRadius: 12 },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent
          toggleTheme={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />
      </Router>
    </ThemeProvider>
  );
}
