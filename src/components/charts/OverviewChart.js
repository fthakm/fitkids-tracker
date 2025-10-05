import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import { getEvaluasiSummary } from "../../services/evaluationsService";

export default function OverviewChart() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let mounted = true;
    getEvaluasiSummary("all").then(res => {
      if (!mounted) return;
      // expect res as [{name, averageScore}]
      // Map to monthly categories if month available; otherwise use provided
      const chart = (res || []).map(r => ({ name: r.name, score: r.averageScore || 0 }));
      setData(chart);
    }).catch(e => {
      console.error(e);
      setData([]);
    });
    return () => { mounted = false; };
  }, []);

  if (data === null) return <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>;

  return (
    <Paper elevation={2} sx={{ p:2 }}>
      <Typography variant="h6" sx={{ mb:2 }}>Overview - Rata-rata Skor</Typography>
      {data.length === 0 ? <Typography variant="body2">Belum ada data latihan.</Typography> :
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>}
    </Paper>
  );
        }
        
