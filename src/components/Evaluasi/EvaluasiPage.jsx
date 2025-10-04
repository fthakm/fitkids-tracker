import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getAllEvaluasi, filterEvaluasi } from "../../services/evaluasiService";
import { getStudents } from "../../services/studentService";

export default function EvaluasiPage() {
  const [evaluasi, setEvaluasi] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    student: "all",
    month: new Date().getMonth() + 1,
  });

  const loadEvaluasi = async () => {
    try {
      setLoading(true);
      const data = await getAllEvaluasi();
      setEvaluasi(data);
      const s = await getStudents();
      setStudents(s);
    } catch (err) {
      console.error("Gagal ambil data evaluasi:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluasi();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const data = await filterEvaluasi(filter.student, filter.month);
      setEvaluasi(data);
    } catch (err) {
      console.error("Filter gagal:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-blue-600">
          Evaluasi Latihan
        </Typography>
        <IconButton color="primary" onClick={loadEvaluasi}>
          <RefreshIcon />
        </IconButton>
      </div>

      <Paper className="p-4 rounded-xl shadow-md space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <TextField
            select
            label="Pilih Siswa"
            value={filter.student}
            onChange={(e) => setFilter({ ...filter, student: e.target.value })}
            fullWidth
          >
            <MenuItem value="all">Semua Siswa</MenuItem>
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Bulan"
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            fullWidth
          >
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AssessmentIcon />}
            onClick={handleFilter}
          >
            Terapkan Filter
          </Button>
        </div>
      </Paper>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : evaluasi.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Belum ada data evaluasi untuk filter ini.
        </Typography>
      ) : (
        <Paper className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nama Siswa</th>
                <th className="p-3 text-left">Jenis Latihan</th>
                <th className="p-3 text-left">Nilai</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {evaluasi.map((e, i) => (
                <tr key={i} className="hover:bg-blue-50 border-b transition">
                  <td className="p-3">{e.student_name}</td>
                  <td className="p-3">{e.exercise_type}</td>
                  <td className="p-3 font-bold text-blue-700">{e.score}</td>
                  <td className="p-3">{e.target}</td>
                  <td className="p-3">
                    {e.score >= e.target ? "✅ Tercapai" : "❌ Belum Tercapai"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
      }
