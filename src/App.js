import React, { useState } from "react";
import { Box, Container, Tabs, Tab, Typography, Button } from "@mui/material";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import StudentList from "./components/StudentList";
import AddEditStudentDialog from "./dialogs/AddEditStudentDialog";
import InputResultsDialog from "./dialogs/InputResultsDialog";

function a11yProps(index) {
  return { id: `main-tab-${index}`, "aria-controls": `main-tabpanel-${index}` };
}

export default function App() {
  const [tab, setTab] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openInput, setOpenInput] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fa" }}>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>FitKids Tracker</Typography>
        <Box sx={{ borderBottom: 1, borderColor: "#eee" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="main tabs">
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Siswa" {...a11yProps(1)} />
            <Tab label="Leaderboard" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {tab === 0 && <Dashboard />}
        {tab === 1 && (
          <StudentList
            onAddStudent={() => setOpenAdd(true)}
            onEditStudent={(s) => setSelectedStudent(s)}
            onInputResults={(s) => {
              setSelectedStudent(s);
              setOpenInput(true);
            }}
          />
        )}
        {tab === 2 && <Leaderboard />}

        <AddEditStudentDialog
          open={openAdd || Boolean(selectedStudent)}
          student={selectedStudent}
          onClose={() => { setOpenAdd(false); setSelectedStudent(null); }}
        />

        <InputResultsDialog
          open={openInput}
          student={selectedStudent}
          onClose={() => setOpenInput(false)}
        />
      </Container>
    </Box>
  );
}
