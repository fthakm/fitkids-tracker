import React from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

export default function EvaluationDetail({ evaluation }) {
  if (!evaluation) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Belum ada evaluasi dipilih</Typography>
      </Paper>
    );
  }

  const getColor = (label) => {
    switch (label) {
      case "Kurang":
        return "error";
      case "Baik":
        return "warning";
      case "Sangat Baik":
        return "success";
      default:
        return "default";
    }
  };

  // === Hitung summary per kategori ===
  const categorySummary = {};
  const overallCounts = { Kurang: 0, Baik: 0, "Sangat Baik": 0 };

  if (evaluation.results?.length > 0) {
    evaluation.results.forEach((res) => {
      if (!categorySummary[res.category]) {
        categorySummary[res.category] = {
          counts: { Kurang: 0, Baik: 0, "Sangat Baik": 0 },
          total: 0,
        };
      }
      categorySummary[res.category].counts[res.label] += 1;
      categorySummary[res.category].total += 1;

      overallCounts[res.label] += 1;
    });
  }

  const getDominantLabel = (counts) => {
    let max = 0;
    let label = "Kurang";
    Object.entries(counts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        label = k;
      }
    });
    return label;
  };

  const overallLabel = getDominantLabel(overallCounts);

  // === Data untuk Radar Chart ===
  const radarData = Object.entries(categorySummary).map(([category, data]) => {
    const label = getDominantLabel(data.counts);
    let score = 1;
    if (label === "Baik") score = 2;
    if (label === "Sangat Baik") score = 3;
    return {
      category,
      score,
      label,
    };
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Detail Evaluasi</Typography>
      <Typography variant="body2" color="textSecondary">
        Tanggal: {evaluation.date}
      </Typography>

      {evaluation.student_name && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Siswa:</strong> {evaluation.student_name}
        </Typography>
      )}

      {/* Tabel detail hasil */}
      <Box mt={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Aspek</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Nilai</TableCell>
              <TableCell>Kategori</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluation.results?.length > 0 ? (
              evaluation.results.map((res, idx) => (
                <TableRow key={idx}>
                  <TableCell>{res.category}</TableCell>
                  <TableCell>{res.test}</TableCell>
                  <TableCell>{res.value}</TableCell>
                  <TableCell>
                    <Chip
                      label={res.label}
                      color={getColor(res.label)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Belum ada hasil evaluasi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">📈 Visualisasi Radar Chart</Typography>
          <Box sx={{ width: "100%", height: 300, mt: 2 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 3]} />
                <Tooltip />
                <Radar
                  name="Evaluasi"
                  dataKey="score"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}

      {/* Summary per kategori */}
      {Object.keys(categorySummary).length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">📊 Ringkasan per Kategori</Typography>
          <Box mt={1}>
            {Object.entries(categorySummary).map(([category, data], idx) => {
              const dominant = getDominantLabel(data.counts);
              return (
                <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                  {category}:{" "}
                  <Chip
                    label={dominant}
                    color={getColor(dominant)}
                    size="small"
                  />
                </Typography>
              );
            })}
          </Box>
        </>
      )}

      {/* Overall summary */}
      {evaluation.results?.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">🏅 Ringkasan Keseluruhan</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Mayoritas hasil evaluasi siswa ini adalah{" "}
            <Chip
              label={overallLabel}
              color={getColor(overallLabel)}
              size="small"
            />
          </Typography>
        </>
      )}
    </Paper>
  );
        }
