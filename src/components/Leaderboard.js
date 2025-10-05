import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../services/leaderboardService";
import {
  Box, Typography, Paper, Grid, Avatar, Chip, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";

export default function Leaderboard({ category = 1 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getLeaderboard(category).then((rows) => {
      if (mounted) setData(rows);
    }).catch((e) => {
      console.error("Leaderboard load error", e);
      if (mounted) setData([]);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [category]);

  if (loading) return <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>;

  return (
    <Paper elevation={2} sx={{ p:2 }}>
      <Typography variant="h6" sx={{ mb:2 }}>Leaderboard</Typography>
      {(!data || data.length === 0) ? (
        <Typography variant="body2">Belum ada data.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((s, i) => (
              <TableRow key={s.id || s.name || i}>
                <TableCell>{i+1}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width:32, height:32 }}>{(s.name || "?").charAt(0)}</Avatar>
                    <Typography>{s.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{s.score ?? 0}</TableCell>
                <TableCell align="right">{s.attendance ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
        }
              
