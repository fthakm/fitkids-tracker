import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getStudents } from "../../services/studentService";
import { getLatihanSummary } from "../../services/latihanService";
import { getLeaderboard } from "../../services/leaderboardService";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedLatihan, setSelectedLatihan] = useState("all");
  const [latihanData, setLatihanData] = useState([]);
  const [rajinData, setRajinData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [mode, setMode] = useState("rajin");

  const COLORS = ["#2563EB", "#CBD5E1"];

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [siswaRes, latihanRes, leaderboardRes] = await Promise.all([
          getStudents(),
          getLatihanSummary(),
          getLeaderboard(),
        ]);
        setStudents(siswaRes);
        setLatihanData(latihanRes.progressChart);
        setRajinData(latihanRes.rajinData);
        setTargetData(latihanRes.targetSummary);
        setLeaderboard(leaderboardRes);
      } catch (err) {
        console.error("Gagal load data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <Typography variant="h5" className="font-bold text-blue-600">
        Dashboard Performa Siswa
      </Typography>

      {/* 1️⃣ Grafik Progress */}
      <Card className="shadow-lg rounded-xl">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <Typography variant="h6" className="font-semibold text-gray-700">
              Grafik Progress Rata-Rata Siswa
            </Typography>
            <div className="flex gap-4 mt-2 md:mt-0">
              <FormControl size="small">
                <InputLabel>Siswa</InputLabel>
                <Select
                  value={selectedStudent}
                  label="Siswa"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <MenuItem value="all">Semua</MenuItem>
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Latihan</InputLabel>
                <Select
                  value={selectedLatihan}
                  label="Latihan"
                  onChange={(e) => setSelectedLatihan(e.target.value)}
                >
                  <MenuItem value="all">Semua</MenuItem>
                  <MenuItem value="lari">Lari</MenuItem>
                  <MenuItem value="pushup">Push-Up</MenuItem>
                  <MenuItem value="situp">Sit-Up</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latihanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="nilai" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2️⃣ Siswa Paling Rajin / Jarang */}
      <Card className="shadow-lg rounded-xl">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold text-gray-700">
              Siswa {mode === "rajin" ? "Paling Rajin" : "Paling Jarang"} Latihan
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, v) => v && setMode(v)}
              size="small"
            >
              <ToggleButton value="rajin">Rajin</ToggleButton>
              <ToggleButton value="jarang">Jarang</ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {rajinData
              .filter((d) => (mode === "rajin" ? d.type === "rajin" : d.type === "jarang"))
              .slice(0, 3)
              .map((s, i) => (
                <Card
                  key={i}
                  className="p-4 border border-gray-200 hover:shadow-md transition"
                >
                  <Typography className="font-semibold text-blue-600">
                    {s.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {s.totalLatihan} sesi latihan
                  </Typography>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 3️⃣ Grafik Target */}
      <Card className="shadow-lg rounded-xl">
        <CardContent>
          <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
            Target Tercapai vs Belum
          </Typography>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={targetData}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={90}
                  label
                >
                  {targetData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div>
              <Typography variant="body1" className="font-semibold mb-2">
                Detail Latihan Belum Tercapai:
              </Typography>
              <ul className="list-disc pl-6 text-sm text-gray-700">
                {targetData
                  .filter((t) => t.label === "Belum Tercapai")[0]?.detail || [
                    "Tidak ada data",
                  ].map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4️⃣ Top Performa Bulanan */}
      <Card className="shadow-lg rounded-xl">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="font-semibold text-gray-700">
              Top Performa Bulan Ini
            </Typography>
            <Button variant="text" size="small">
              Lihat Semua
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((s, i) => (
              <Card
                key={i}
                className="p-4 border border-gray-200 hover:shadow-md transition"
              >
                <Typography className="font-semibold text-blue-600">
                  {s.name}
                </Typography>
                <Typography variant="body2">
                  Skor Rata-rata: <b>{s.avgScore}</b>
                </Typography>
                <Typography variant="body2">
                  Kehadiran: <b>{s.attendance}%</b>
                </Typography>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
      }
