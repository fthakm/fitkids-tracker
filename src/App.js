import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Box, Paper } from "@mui/material";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/StudentList";
import Leaderboard from "./components/Leaderboard";
import StudentDetail from "./components/StudentDetail";

function a11yProps(index) {
  return {
    id: `main-tab-${index}`,
    "aria-controls": `main-tabpanel-${index}`,
  };
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
            <Tab label="Siswa" {...a11yProps(1)} />
            <Tab label="Leaderboard" {...a11yProps(2)} />
          </Tabs>
        </Paper>

        {/* Dashboard */}
        {tab === 0 && <Dashboard />}

        {/* Student List / Detail */}
        {tab === 1 && !selectedStudent && (
          <StudentList onSelectStudent={setSelectedStudent} />
        )}
        {tab === 1 && selectedStudent && (
          <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
        )}

        {/* Leaderboard */}
        {tab === 2 && <Leaderboard />}
      </Container>
    </Box>
  );
}
