import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getStudents } from "../../services/studentService";
import { getEvaluasiSummary } from "../../services/evaluationService";

export default function StudentProgressChart() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let mounted = true;
    Promise.all([ getEvaluasiSummary("all"), getStudents() ]).then(([summary, students]) => {
      if (!mounted) return;
      // summary: [{name, averageScore}]
      const map = (summary || []).map(s => ({ name: s.name, score: s.averageScore || 0 }));
      setData(map);
    }).catch(e => {
      console.error(e);
      setData([]);
    });
    return () => { mounted = false; };
  }, []);

  if (data === null) return <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>;

  return (
    <Paper elevation={2} sx={{ p:2 }}>
      <Typography variant="h6" sx={{ mb:2 }}>Perkembangan Siswa</Typography>
      {data.length === 0 ? <Typography variant="body2">Belum ada data.</Typography> :
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" barSize={20} />
        </BarChart>
      </ResponsiveContainer>}
    </Paper>
  );
      }
                      
