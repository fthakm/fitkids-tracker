import React, { useEffect, useState } from "react";
import { Paper, Typography, Tabs, Tab, CircularProgress } from "@mui/material";
import { getLeaderboard } from "../../services/leaderboardService";

export default function LeaderboardPage() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["Paling Rajin", "Performa Terbaik", "Kurang Aktif"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const leaderboardData = await getLeaderboard(tab);
        setData(leaderboardData);
      } catch (err) {
        console.error("Gagal ambil leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tab]);

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h5" className="font-bold text-blue-600">
        Leaderboard Siswa
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        textColor="primary"
        indicatorColor="primary"
        centered
      >
        {tabs.map((label, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <Paper className="p-4 rounded-xl shadow-md">
          {data.length === 0 ? (
            <Typography align="center" color="textSecondary">
              Tidak ada data leaderboard.
            </Typography>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Peringkat</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-blue-50 border-b ${
                      i < 3 ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="p-3 font-semibold text-blue-700">{i + 1}</td>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3 font-medium">{s.score}</td>
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
