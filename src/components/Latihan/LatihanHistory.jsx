import React, { useEffect, useState } from "react";
import { Paper, Typography, CircularProgress, Button } from "@mui/material";
import { getLatihanSessions } from "../../services/latihanService";

export default function LatihanHistory({ onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatihanSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" className="font-bold text-blue-600">
          Riwayat Latihan
        </Typography>
        <Button onClick={onClose} color="inherit">
          Tutup
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : sessions.length === 0 ? (
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
                <th className="p-3 text-left">Peserta</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50 border-b transition">
                  <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                  <td className="p-3">{s.exerciseType}</td>
                  <td className="p-3">{(s.students || []).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
}
