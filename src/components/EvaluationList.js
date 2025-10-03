import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function EvaluationList({ evaluations, onSelect }) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell>Siswa</TableCell>
            <TableCell>Jumlah Tes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {evaluations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">Belum ada evaluasi</TableCell>
            </TableRow>
          ) : (
            evaluations.map((evalItem) => (
              <TableRow
                key={evalItem.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onSelect(evalItem)}
              >
                <TableCell>{evalItem.date}</TableCell>
                <TableCell>{evalItem.studentName}</TableCell>
                <TableCell>{evalItem.results?.length || 0}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
