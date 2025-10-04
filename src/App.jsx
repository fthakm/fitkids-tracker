import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './pages/MainLayout';
import DashboardPage from './components/Dashboard/DashboardPage';
import StudentList from './components/Students/StudentList';
import StudentDetail from './components/Students/StudentDetail';
import LatihanList from './components/Latihan/LatihanList';
import EvaluasiPage from './components/Evaluasi/EvaluasiPage';
import LeaderboardPage from './components/Leaderboard/LeaderboardPage';

export default function App(){
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({ palette: { mode: darkMode?'dark':'light', primary: { main:'#1976d2' }, secondary: { main:'#ff9800' } }, shape:{ borderRadius:10 } });
  const mockStudents = [
    { id:1, name:'Ali', age:8, gender:'L', phone:'0812', parent_name:'Bapak A' },
    { id:2, name:'Budi', age:10, gender:'L', phone:'0822', parent_name:'Ibu B' },
    { id:3, name:'Citra', age:12, gender:'P', phone:'0833', parent_name:'Ibu C' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainLayout>
          <Routes>
            <Route path='/dashboard' element={<DashboardPage/>} />
            <Route path='/siswa' element={<StudentList students={mockStudents} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}} onInput={()=>{}} onView={()=>{}} />} />
            <Route path='/latihan' element={<LatihanList/>} />
            <Route path='/evaluasi' element={<EvaluasiPage/>} />
            <Route path='/leaderboard' element={<LeaderboardPage/>} />
            <Route path='/' element={<Navigate to='/dashboard' replace/>} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}
