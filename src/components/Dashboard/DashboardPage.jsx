import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudents } from '../../services/studentService';

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [ageGroup, setAgeGroup] = useState('all');
  useEffect(()=>{ getStudents().then(setStudents).catch(()=>{}); },[]);

  const data = [
    { month: 'Jan', avg: 60 },
    { month: 'Feb', avg: 65 },
    { month: 'Mar', avg: 70 },
  ];

  return (
    <Box>
      <Typography variant='h5' gutterBottom>Dashboard</Typography>
      <Paper sx={{ p:2, mb:2 }}>
        <Box sx={{ display:'flex', gap:2, alignItems:'center', mb:2 }}>
          <FormControl size='small'><InputLabel>Filter Usia</InputLabel><Select value={ageGroup} label='Filter Usia' onChange={(e)=>setAgeGroup(e.target.value)}><MenuItem value='all'>Semua</MenuItem><MenuItem value='6-8'>6-8</MenuItem></Select></FormControl>
        </Box>
        <ResponsiveContainer width='100%' height={200}><LineChart data={data}><XAxis dataKey='month'/><YAxis/><Tooltip/><Line type='monotone' dataKey='avg' stroke='#1976d2' strokeWidth={3}/></LineChart></ResponsiveContainer>
      </Paper>
    </Box>
  );
}
