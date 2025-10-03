import React from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer
} from "@mui/material";

export default function Leaderboard({ students }) {
  if (!students || students.length === 0) {
    return <p>Belum ada data leaderboard</p>;
  }

  // misalnya sorting by score kalau ada
  const sorted = [...students].sort((a, b) => (b?.score || 0) - (a?.score || 0));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell>Usia</TableCell>
            <TableCell>Skor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((s, i) => (
            <TableRow key={i}>
              <TableCell>{s?.name || "-"}</TableCell>
              <TableCell>{s?.age || "-"}</TableCell>
              <TableCell>{s?.score || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
