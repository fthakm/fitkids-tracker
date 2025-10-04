import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getEvaluasiSummary } from "../../services/evaluasiService";

export default function EvaluasiPage() {
  const [loading, setLoading] = useState(true);
  const [evaluasiData, setEvaluasiData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getEvaluasiSummary(selectedMonth);
        setEvaluasiData(data);
      } catch (err) {
        console.error("Gagal mengambil data evaluasi:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedMonth]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-blue-600">
          Evaluasi Siswa
        </Typography>

        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Bulan</InputLabel>
          <Select
            value={selectedMonth}
            label="Bulan"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="1">Januari</MenuItem>
            <MenuItem value="2">Februari</MenuItem>
            <MenuItem value="3">Maret</MenuItem>
            <MenuItem value="4">April</MenuItem>
            <MenuItem value="5">Mei</MenuItem>
            <MenuItem value="6">Juni</MenuItem>
            <MenuItem value="7">Juli</MenuItem>
            <MenuItem value="8">Agustus</MenuItem>
            <MenuItem value="9">September</MenuItem>
            <MenuItem value="10">Oktober</MenuItem>
            <MenuItem value="11">November</MenuItem>
            <MenuItem value="12">Desember</MenuItem>
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <Paper className="p-4 rounded-xl shadow-md">
          {evaluasiData.length === 0 ? (
            <Typography align="center" color="textSecondary">
              Tidak ada data evaluasi.
            </Typography>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Nilai Rata-rata</th>
                  <th className="p-3 text-left">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {evaluasiData.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50 border-b">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 font-medium">{s.averageScore}</td>
                    <td
                      className={`p-3 ${
                        s.averageScore >= 80
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }`}
                    >
                      {s.averageScore >= 80 ? "Tercapai" : "Belum Tercapai"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Paper>
      )}
    </div>
  );
}
