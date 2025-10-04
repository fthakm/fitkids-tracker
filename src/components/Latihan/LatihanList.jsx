import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { getAllLatihan } from "../../services/latihanService";
import LatihanForm from "./LatihanForm";
import LatihanHistory from "./LatihanHistory";

export default function LatihanList() {
  const [latihan, setLatihan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadLatihan = async () => {
    try {
      setLoading(true);
      const data = await getAllLatihan();
      setLatihan(data);
    } catch (err) {
      console.error("Gagal ambil data latihan:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatihan();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-blue-600">
          Data Latihan
        </Typography>
        <div className="flex gap-3">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => setOpenForm(true)}
          >
            Tambah Latihan
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            color="primary"
            onClick={() => setShowHistory(true)}
          >
            Riwayat
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : latihan.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Belum ada data latihan.
        </Typography>
      ) : (
        <Paper className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Jenis Latihan</th>
                <th className="p-3 text-left">Jumlah Peserta</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {latihan.map((l) => (
                <tr key={l.id} className="hover:bg-blue-50 border-b transition">
                  <td className="p-3">{new Date(l.date).toLocaleDateString()}</td>
                  <td className="p-3">{l.type}</td>
                  <td className="p-3">{l.participants?.length || 0}</td>
                  <td className="p-3">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => alert(`Lihat detail latihan ${l.type}`)}
                    >
                      <FitnessCenterIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}

      {openForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[600px]">
            <LatihanForm
              onClose={() => setOpenForm(false)}
              onSuccess={() => {
                setOpenForm(false);
                loadLatihan();
              }}
            />
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[95%] md:w-[800px] overflow-auto max-h-[90vh]">
            <LatihanHistory onClose={() => setShowHistory(false)} />
          </div>
        </div>
      )}
    </div>
  );
            }
