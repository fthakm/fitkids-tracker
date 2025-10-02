import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Tabs, Tab, Container, Snackbar, Alert } from "@mui/material";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import StudentList from "./components/StudentList";
import { studentService } from "./services/studentService";

function a11yProps(index) {
  return {
    id: `main-tab-${index}`,
    "aria-controls": `main-tabpanel-${index}`,
  };
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await studentService.getAllStudents();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ bgcolor: "#f7f9fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            FitKids Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
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
          <Tab label="Siswa" {...a11yProps(2)} />
        </Tabs>

        {tab === 0 && <Dashboard students={students} showSnackbar={showSnackbar} />}
        {tab === 1 && <Leaderboard students={students} />}
        {tab === 2 && <StudentList students={students} setStudents={setStudents} showSnackbar={showSnackbar} />}
      </Container>

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
    </Box>
  );
}
