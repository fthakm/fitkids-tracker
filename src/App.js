import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Container, Box, Paper, Button, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, IconButton, Alert
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ageGroups = ["6-8", "9-11", "12-15", "16+"];

const targetData = {
  "6-8": { Skipping: 120, "Jump Squat": 35, "Shuttle Run 4x10": 11 },
  "9-11": { Skipping: 160, "Jump Squat": 40, "Shuttle Run 6x10": 15, "Sprint 20m": 5 },
  "12-15": { "Yo-Yo Test Lvl 15": 0, PushUp: 40, SitUp: 40, "Jump Squat": 30, Skipping: 190 },
  "16+": { "Yo-Yo Test Lvl 17": 0, PushUp: 45, SitUp: 50, "Jump Squat": 45, Skipping: 225 }
};

function a11yProps(index) {
  return {
    id: `main-tab-${index}`,
    "aria-controls": `main-tabpanel-${index}`,
  };
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", age: ageGroups[0] });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openInput, setOpenInput] = useState(false);
  const [inputResults, setInputResults] = useState({});
  const [filterAge, setFilterAge] = useState(ageGroups[0]);

  // Persist students to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fitkids-students");
    if (saved) setStudents(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("fitkids-students", JSON.stringify(students));
  }, [students]);

  // --- CRUD ---
  const handleAddStudent = () => {
    if (!newStudent.name.trim()) {
      setSnackbar({ open: true, message: "Nama siswa wajib diisi", severity: "error" });
      return;
    }
    if (students.some(s => s.name === newStudent.name.trim())) {
      setSnackbar({ open: true, message: "Nama siswa sudah ada", severity: "error" });
      return;
    }
    setStudents([...students, { ...newStudent, name: newStudent.name.trim(), results: [], badge: "", notes: "" }]);
    setSnackbar({ open: true, message: "Siswa ditambahkan", severity: "success" });
    setOpenAdd(false);
    setNewStudent({ name: "", age: ageGroups[0] });
  };

  const handleDeleteStudent = (name) => {
    if (window.confirm("Yakin hapus siswa ini?")) {
      setStudents(students.filter(s => s.name !== name));
      setSnackbar({ open: true, message: "Siswa dihapus", severity: "success" });
    }
  };

  // --- Input Hasil ---
  const handleOpenInput = (student) => {
    setSelectedStudent(student);
    setInputResults({});
    setOpenInput(true);
  };
  const handleSaveResults = () => {
    if (!selectedStudent) return;
    const date = new Date().toISOString().split("T")[0];
    const exs = Object.keys(targetData[selectedStudent.age]);
    for (const ex of exs) {
      if (inputResults[ex] === undefined || inputResults[ex] === "") {
        setSnackbar({ open: true, message: `Nilai ${ex} wajib diisi`, severity: "error" });
        return;
      }
    }
    setStudents(students.map(s => {
      if (s.name !== selectedStudent.name) return s;
      const results = exs.map(ex => ({
        date, exercise: ex, target: targetData[s.age][ex], value: Number(inputResults[ex])
      }));
      const badge = results.every(r => r.value >= r.target) ? "✔" : "❌";
      return { ...s, results: [...s.results, ...results], badge };
    }));
    setOpenInput(false);
    setSnackbar({ open: true, message: "Nilai tersimpan", severity: "success" });
  };

  // --- Export ---
  const exportPDF = (student) => {
    const doc = new jsPDF();
    doc.text(`Laporan Latihan - ${student.name}`, 14, 20);
    doc.text(`Usia: ${student.age}`, 14, 30);
    doc.text(`Badge: ${student.badge || "-"}`, 14, 40);
    const rows = student.results.map(r => [r.date, r.exercise, r.target, r.value, r.value >= r.target ? "✔" : "❌"]);
    doc.autoTable({ head: [["Tanggal", "Latihan", "Target", "Hasil", "Status"]], body: rows, startY: 50 });
    doc.save(`laporan_${student.name}.pdf`);
    setSnackbar({ open: true, message: "Export PDF berhasil", severity: "success" });
  };
  const exportExcel = (student) => {
    const ws = XLSX.utils.json_to_sheet(student.results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Latihan");
    XLSX.writeFile(wb, `laporan_${student.name}.xlsx`);
    setSnackbar({ open: true, message: "Export Excel berhasil", severity: "success" });
  };

  // --- Leaderboard ---
  const leaderboard = [...students].sort(
    (a, b) =>
      b.results.filter(r => r.value >= r.target).length -
      a.results.filter(r => r.value >= r.target).length
  );

  return (
    <Box sx={{ bgcolor: "#f7f9fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            FitKids Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderRadius: 2, borderBottom: 1, borderColor: "#eee" }}
          >
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Leaderboard" {...a11yProps(1)} />
            <Tab label="Data Siswa" {...a11yProps(2)} />
            <Tab label="Kelola" {...a11yProps(3)} />
          </Tabs>
        </Paper>

        {/* Dashboard */}
        {tab === 0 && (
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>Dashboard</Typography>
            <DataGrid
              rows={students.map((s, i) => ({ ...s, id: i + 1 }))}
              columns={[
                { field: "name", headerName: "Nama Siswa", width: 180 },
                { field: "age", headerName: "Usia", width: 100 },
                { field: "badge", headerName: "Badge", width: 90 },
                {
                  field: "action", headerName: "Aksi", width: 220, renderCell: (params) => (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => exportPDF(params.row)}
                        startIcon={<DownloadIcon />}
                      >PDF</Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => exportExcel(params.row)}
                        startIcon={<DownloadIcon />}
                      >Excel</Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleOpenInput(params.row)}
                      >Input Nilai</Button>
                    </>
                  )
                }
              ]}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2 }}
            />
          </Box>
        )}

        {/* Leaderboard */}
        {tab === 1 && (
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>Leaderboard</Typography>
            <ol>
              {leaderboard.map((s, i) => (
                <li key={s.name}>
                  <strong>{s.name}</strong> ({s.age}) - ✔ {s.results.filter(r => r.value >= r.target).length} latihan memenuhi target {s.badge === "✔" && "🏅"}
                </li>
              ))}
            </ol>
          </Box>
        )}

        {/* Data Siswa */}
        {tab === 2 && (
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>Data Siswa</Typography>
            <Box mb={2}>
              <Select value={filterAge} onChange={e => setFilterAge(e.target.value)}>
                {ageGroups.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </Box>
            <DataGrid
              rows={students.filter(s => s.age === filterAge).map((s, i) => ({ ...s, id: i + 1 }))}
              columns={[
                { field see: "name", headerName: "Nama", width: 180 },
                { field: "badge", headerName: "Badge", width: 90 },
                { field: "notes", headerName: "Catatan", width: 160 },
                {
                  field: "action", headerName: "Aksi", width: 180, renderCell: (params) => (
                    <IconButton color="error" onClick={() => handleDeleteStudent(params.row.name)}>
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              ]}
              autoHeight
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              sx={{ mt: 2, bgcolor: "#fff", borderRadius: 2 }}
            />
          </Box>
        )}

        {/* Kelola Siswa */}
        {tab === 3 && (
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>Kelola Siswa</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{ mb: 2 }}
            >Tambah Siswa</Button>
            <ul>
              {students.map(s => (
                <li key={s.name}>
                  <b>{s.name}</b> ({s.age})
                  <IconButton color="error" onClick={() => handleDeleteStudent(s.name)}><DeleteIcon /></IconButton>
                </li>
              ))}
            </ul>
          </Box>
        )}

        {/* Dialog Tambah Siswa */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogTitle>Tambah Siswa</DialogTitle>
          <DialogContent>
            <TextField
              label="Nama Siswa"
              value={newStudent.name}
              onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Select
              label="Usia"
              value={newStudent.age}
              onChange={e => setNewStudent({ ...newStudent, age: e.target.value })}
              fullWidth
            >
              {ageGroups.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>Batal</Button>
            <Button variant="contained" onClick={handleAddStudent}>Tambah</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Input Nilai */}
        <Dialog open={openInput} onClose={() => setOpenInput(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Input Nilai untuk {selectedStudent?.name}</DialogTitle>
          <DialogContent>
            {selectedStudent &&
              Object.keys(targetData[selectedStudent.age]).map(ex => (
                <TextField
                  key={ex}
                  label={`${ex} (Target: ${targetData[selectedStudent.age][ex]})`}
                  type="number"
                  fullWidth
                  margin="dense"
                  value={inputResults[ex] ?? ""}
                  onChange={e => setInputResults({ ...inputResults, [ex]: e.target.value })}
                />
              ))
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInput(false)}>Batal</Button>
            <Button variant="contained" onClick={handleSaveResults}>Simpan</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
