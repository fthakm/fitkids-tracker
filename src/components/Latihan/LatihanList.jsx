import React, { useEffect, useState } from "react";
import { Paper, Button, Typography, IconButton, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import { getLatihanSessions, deleteLatihanSession } from "../../services/latihanService";
import LatihanForm from "./LatihanForm";
import LatihanHistory from "./LatihanHistory";

export default function LatihanList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getLatihanSessions();
      setSessions(data);
    } catch (error) {
      console.error("Gagal ambil data latihan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus sesi latihan ini?")) return;
    await deleteLatihanSession(id);
    loadSessions();
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-blue-600">
          Data Latihan
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => setAdding(true)}
          >
            Tambah Latihan
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
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
      ) : sessions.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Belum ada sesi latihan.
        </Typography>
      ) : (
        <Paper className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Jenis Latihan</th>
                <th className="p-3 text-left">Jumlah Siswa</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50 border-b transition">
                  <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-3">{s.exerciseType}</td>
                  <td className="p-3">{s.students?.length || 0}</td>
                  <td className="p-3">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(s.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}

      {adding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[600px]">
            <LatihanForm
              onClose={() => setAdding(false)}
              onSaved={loadSessions}
            />
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[95%] md:w-[800px]">
            <LatihanHistory onClose={() => setShowHistory(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
