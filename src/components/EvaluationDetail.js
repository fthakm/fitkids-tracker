// components/EvaluationDetail.js
import React from "react";
import { Paper, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";
import { evaluationCriteria } from "../data/evaluationCriteria";
import { classifyScore } from "../utils/evaluationHelpers";

export default function EvaluationDetail({ evaluation }) {
  if (!evaluation) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">Pilih evaluasi untuk melihat detail</Typography>
      </Paper>
    );
  }

  const { ageGroup, results = [] } = evaluation;
  const criteria = evaluationCriteria[ageGroup] || [];

  // transform data ke format untuk RadarChart
  const radarData = criteria.map((c) => {
    const res = results.find((r) => r.test === c.test);
    const score = res?.score ?? 0;
    const label = classifyScore(score, c.ranges);

    return {
      subject: c.category,
      skor: score,
      level: label,
      fullMark: 100, // opsional: biar sumbu normal
    };
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Detail Evaluasi - {evaluation.date}
      </Typography>

      {/* Radar Chart */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <RadarChart
          cx={250}
          cy={200}
          outerRadius={150}
          width={500}
          height={400}
          data={radarData}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar
            name="Skor Siswa"
            dataKey="skor"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </Box>

      {/* Tabel Detail */}
      <Typography variant="subtitle1" gutterBottom>
        Rincian Tes
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Kategori</TableCell>
            <TableCell>Tes</TableCell>
            <TableCell>Skor</TableCell>
            <TableCell>Hasil</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {criteria.map((c, idx) => {
            const res = results.find((r) => r.test === c.test);
            const score = res?.score ?? "-";
            const label = score !== "-" ? classifyScore(score, c.ranges) : "-";

            return (
              <TableRow key={idx}>
                <TableCell>{c.category}</TableCell>
                <TableCell>{c.test}</TableCell>
                <TableCell>{score}</TableCell>
                <TableCell>{label}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
