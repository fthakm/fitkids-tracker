import React, { useState, useRef } from "react";
import { Button } from "./components/ui/Button";
import { Card, CardContent } from "./components/ui/Card";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function App() {
  const [students, setStudents] = useState([
    {
      name: "Rafi",
      ageGroup: "9-11",
      results: [
        { date: '2025-10-01', exercise: 'Skipping', target: 160, value: 120 },
        { date: '2025-10-01', exercise: 'Jump Squat', target: 40, value: 35 },
        { date: '2025-10-01', exercise: 'Shuttle Run 6x10', target: 15, value: 17 },
        { date: '2025-10-01', exercise: 'Sprint 20m', target: 5, value: 5 },
      ],
      badge: '',
    },
  ]);

  const chartRefs = useRef({});

  const exportPDF = (student) => {
    const doc = new jsPDF();
    doc.text(`Laporan Latihan - ${student.name}`, 14, 20);
    doc.text(`Usia: ${student.ageGroup}`, 14, 30);
    doc.text(`Badge: ${student.badge || "-"}`, 14, 40);

    const canvas = chartRefs.current[student.name];
    if (canvas) {
      const chartImage = canvas.toBase64Image();
      doc.addImage(chartImage, 'PNG', 15, 50, 180, 90);
    }

    const rows = student.results.map((r) => [
      r.date,
      r.exercise,
      r.target,
      r.value,
      r.value >= r.target ? "✔" : "❌",
    ]);

    autoTable(doc, {
      head: [["Tanggal", "Latihan", "Target", "Hasil", "Status"]],
      body: rows,
      startY: 150,
    });

    doc.save(`laporan_${student.name}.pdf`);
  };

  const generateRecommendation = (student) => {
    return student.results.map(r => {
      let status = r.value >= r.target ? '✔' : '❌';
      let recommendation = '';
      if (r.value < r.target) {
        switch (r.exercise) {
          case 'Skipping':
            recommendation = 'Tambah 2 sesi 5-10 menit skipping, fokus teknik';
            break;
          case 'Jump Squat':
            recommendation = 'Latihan squat + calf raise 3x/minggu';
            break;
          case 'Shuttle Run 6x10':
            recommendation = 'Sprint pendek 4x/minggu + agility drills';
            break;
          case 'Sprint 20m':
            recommendation = 'Tambahkan sprint 25m 2x/minggu';
            break;
          case 'Push Up':
            recommendation = 'Push-up + core strengthening 3x/minggu';
            break;
          case 'Sit Up':
            recommendation = 'Pertahankan rutin 3x/minggu';
            break;
          case 'Yo-Yo Test lvl 15':
            recommendation = 'Latihan endurance ringan + lari interval 2x/minggu';
            break;
          default:
            recommendation = 'Latihan rutin sesuai kemampuan';
        }
      } else {
        recommendation = 'Pertahankan performa atau naik level';
      }
      return { ...r, status, recommendation };
    });
  };

  const getChartData = (student) => {
    const labels = student.results.map(r => r.date);
    const exercises = [...new Set(student.results.map(r => r.exercise))];

    const colors = {
      Skipping: '#0000FF',
      'Push Up': '#FF0000',
      'Sit Up': '#00FF00',
      'Jump Squat': '#800080',
      'Shuttle Run': '#FFA500',
      'Sprint 20m': '#000000',
      'Yo-Yo Test': '#A52A2A',
    };

    const datasets = exercises.map(ex => ({
      label: ex,
      data: student.results.filter(r => r.exercise === ex).map(r => r.value),
      borderColor: colors[ex] || '#000000',
      backgroundColor: colors[ex] || '#000000',
      tension: 0,
      fill: false,
      pointRadius: 0,
    }));

    return { labels, datasets };
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Aplikasi Track Latihan Anak</h1>

      {students.map((s, idx) => {
        const recommendations = generateRecommendation(s);
        return (
          <Card key={idx} className="mb-6">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">{s.name} ({s.ageGroup})</h2>
              <Button onClick={() => alert('Rekomendasi Mingguan Diperbarui!')}>Generate Plan Mingguan</Button>
              <table className="w-full border mt-4">
                <thead>
                  <tr>
                    <th className="border p-2">Latihan</th>
                    <th className="border p-2">Target</th>
                    <th className="border p-2">Hasil Terakhir</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Rekomendasi Mingguan</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((r, i) => (
                    <tr key={i} className={r.status === '❌' ? 'bg-red-100' : 'bg-green-100'}>
                      <td className="border p-2">{r.exercise}</td>
                      <td className="border p-2">{r.target}</td>
                      <td className="border p-2">{r.value}</td>
                      <td className="border p-2">{r.status}</td>
                      <td className="border p-2">{r.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'none' }}>
                <Line ref={el => chartRefs.current[s.name] = el?.canvas} data={getChartData(s)} />
              </div>
              <Button onClick={() => exportPDF(s)} className="mt-2">📑 Export PDF</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
      }
