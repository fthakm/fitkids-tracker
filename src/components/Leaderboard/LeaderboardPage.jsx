import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getLeaderboard } from "../../services/leaderboardService";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaders(data);
    } catch (err) {
      console.error("Gagal ambil leaderboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-yellow-900";
      case 2:
        return "bg-gray-300 text-gray-800";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-blue-50 text-blue-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="font-bold text-blue-600 flex items-center gap-2">
          <EmojiEventsIcon color="primary" />
          Leaderboard Siswa
        </Typography>
        <IconButton color="primary" onClick={loadLeaderboard}>
          <RefreshIcon />
        </IconButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : leaders.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Belum ada data leaderboard.
        </Typography>
      ) : (
        <Paper className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Peringkat</th>
                <th className="p-3 text-left">Nama Siswa</th>
                <th className="p-3 text-left">Total Nilai</th>
                <th className="p-3 text-left">Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, i) => (
                <tr
                  key={l.id}
                  className={`border-b hover:bg-blue-50 transition ${i < 3 ? "font-semibold" : ""}`}
                >
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getRankColor(
                        i + 1
                      )}`}
                    >
                      #{i + 1}
                    </span>
                  </td>
                  <td className="p-3 flex items-center gap-3">
                    <Avatar
                      alt={l.name}
                      src={l.avatar_url || ""}
                      className="border border-blue-400"
                    />
                    <span>{l.name}</span>
                  </td>
                  <td className="p-3 text-blue-700 font-bold">{l.total_score}</td>
                  <td className="p-3">{l.avg_score.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
                  }
