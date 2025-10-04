import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getStudents } from "../../services/studentService";
import { getLatihanData } from "../../services/latihanService";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [filterAge, setFilterAge] = useState("all");
  const [filterLatihan, setFilterLatihan] = useState("all");
  const [latihanData, setLatihanData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const studentsData = await getStudents();
      setStudents(studentsData);
      const latihan = await getLatihanData();
      setLatihanData(latihan);
    } catch (err) {
      console.error("Gagal ambil data dashboard:", err.message);
    }
  };

  // Mock data buat contoh tampilan grafik
  const avgProgressData = [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 80 },
    { month: "Mar", score: 78 },
    { month: "Apr", score: 85 },
    { month: "May", score: 90 },
    { month: "Jun", score: 88 },
  ];

  const performanceData = [
    { name: "Rafi", avg: 92 },
    { name: "Dina", avg: 87 },
    { name: "Fajar", avg: 84 },
  ];

  const lazyStudents = [
    { name: "Bima", latihan: 3 },
    { name: "Lala", latihan: 4 },
    { name: "Gilang", latihan: 5 },
  ];

  const targetData = [
    { status: "Mencapai Target", jumlah: 18 },
    { status: "Belum Mencapai", jumlah: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* ======= HEADER ======= */}
      <Typography variant="h5" className="font-bold text-blue-600">
        Dashboard Aktivitas Siswa
      </Typography>

      {/* ======= FILTER ======= */}
      <Box className="flex flex-wrap gap-4">
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filter Usia</InputLabel>
          <Select
            value={filterAge}
            label="Filter Usia"
            onChange={(e) => setFilterAge(e.target.value)}
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="7-9">7-9 tahun</MenuItem>
            <MenuItem value="10-12">10-12 tahun</MenuItem>
            <MenuItem value="13-15">13-15 tahun</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filter Latihan</InputLabel>
          <Select
            value={filterLatihan}
            label="Filter Latihan"
            onChange={(e) => setFilterLatihan(e.target.value)}
          >
            <MenuItem value="all">Semua Latihan</MenuItem>
            <MenuItem value="lari">Lari</MenuItem>
            <MenuItem value="lompat">Lompat</MenuItem>
            <MenuItem value="pushup">Push Up</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ======= GRAFIK PROGRESS ======= */}
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4 text-gray-700">
            Grafik Rata-rata Perkembangan Latihan
          </Typography>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#1e3a8a" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ======= SISWA TERBAIK ======= */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-700"
              >
                3 Siswa Paling Rajin Latihan
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography
                variant="h6"
                className="font-semibold mb-4 text-gray-700"
              >
                3 Siswa Paling Jarang Latihan
              </Typography>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lazyStudents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="latihan"
                      fill="#f43f5e"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ======= TARGET CAPAIAN ======= */}
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-4 text-gray-700">
            Pencapaian Target Bulanan
          </Typography>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
                    }
