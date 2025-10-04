import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getAverageProgress, getTopStudents } from "../../services/evaluasiService";

const DashboardPage = () => {
  const [usiaFilter, setUsiaFilter] = useState("all");
  const [latihanFilter, setLatihanFilter] = useState("all");
  const [progressData, setProgressData] = useState([]);
  const [topRajin, setTopRajin] = useState([]);
  const [topJarang, setTopJarang] = useState([]);
  const [topPerforma, setTopPerforma] = useState([]);
  const [targetData, setTargetData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const progress = await getAverageProgress(usiaFilter, latihanFilter);
      const { rajin, jarang, performa, target } = await getTopStudents();
      setProgressData(progress);
      setTopRajin(rajin);
      setTopJarang(jarang);
      setTopPerforma(performa);
      setTargetData(target);
    };
    fetchData();
  }, [usiaFilter, latihanFilter]);

  const COLORS = ["#2563eb", "#60a5fa", "#dbeafe", "#1e3a8a"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Typography
        variant="h4"
        className="font-bold text-blue-700 tracking-wide mb-4"
      >
        Dashboard Performa Siswa
      </Typography>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Usia</InputLabel>
          <Select
            value={usiaFilter}
            onChange={(e) => setUsiaFilter(e.target.value)}
            label="Filter Usia"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="7-9">7–9 Tahun</MenuItem>
            <MenuItem value="10-12">10–12 Tahun</MenuItem>
            <MenuItem value="13-15">13–15 Tahun</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Jenis Latihan</InputLabel>
          <Select
            value={latihanFilter}
            onChange={(e) => setLatihanFilter(e.target.value)}
            label="Jenis Latihan"
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="lari">Lari</MenuItem>
            <MenuItem value="pushup">Push Up</MenuItem>
            <MenuItem value="situp">Sit Up</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Grafik Section */}
      <Grid container spacing={4}>
        {/* Grafik 1: Progress Latihan */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography variant="h6" className="mb-3 font-semibold text-blue-600">
                Rata-rata Progress Latihan
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rataRata" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafik 2: Siswa Rajin & Jarang */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography variant="h6" className="mb-3 font-semibold text-blue-600">

Aditya, [10/4/2025 3:40 PM]
Siswa Paling Rajin vs Jarang Latihan
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[...topRajin, ...topJarang]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jumlahLatihan" fill="#3b82f6" name="Rajin" />
                  <Bar dataKey="jumlahJarang" fill="#93c5fd" name="Jarang" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafik 3: Performa Terbaik & Terburuk */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography variant="h6" className="mb-3 font-semibold text-blue-600">
                Performa Terbaik & Terburuk
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topPerforma}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="skor" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Grafik 4: Persentase Target */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-md rounded-xl">
            <CardContent>
              <Typography variant="h6" className="mb-3 font-semibold text-blue-600">
                Pencapaian Target Bulanan
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={targetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      ${name}: ${(percent * 100).toFixed(0)}%
                    }
                  >
                    {targetData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;
