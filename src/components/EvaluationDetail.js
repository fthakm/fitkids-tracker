import { useEffect, useState } from "react";
import { getEvaluationsByStudent } from "@/services/evaluationService";
import { Card, CardContent } from "@/components/ui/card";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer,
} from "recharts";

export default function EvaluationDetail({ student }) {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    if (student?.id) {
      loadData();
    }
    async function loadData() {
      const data = await getEvaluationsByStudent(student.id);
      setEvaluations(data);
    }
  }, [student]);

  if (!student) {
    return (
      <Card className="p-4">
        <CardContent>Belum ada siswa dipilih</CardContent>
      </Card>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card className="p-4">
        <CardContent>Belum ada evaluasi untuk {student.name}</CardContent>
      </Card>
    );
  }

  // ambil evaluasi terakhir
  const latest = evaluations[0];
  const chartData = latest.results.map((r) => ({
    subject: r.test,
    value: mapToNumeric(r.label),
  }));

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-2">Evaluasi Terbaru: {student.name}</h2>
      <p className="text-sm text-gray-500 mb-4">Tanggal: {latest.date}</p>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 3]} tickFormatter={mapBackLabel} />
            <Tooltip formatter={(val) => mapBackLabel(val)} />
            <Radar
              name="Evaluasi"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Detail Hasil</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Tes</th>
              <th className="border p-2">Nilai</th>
              <th className="border p-2">Predikat</th>
            </tr>
          </thead>
          <tbody>
            {latest.results.map((r, i) => (
              <tr key={i}>
                <td className="border p-2">{r.category}</td>
                <td className="border p-2">{r.test}</td>
                <td className="border p-2">{r.value}</td>
                <td className="border p-2 font-semibold">{r.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// 🔹 helper utk Radar Chart mapping
function mapToNumeric(label) {
  switch (label) {
    case "Kurang": return 1;
    case "Baik": return 2;
    case "Sangat Baik": return 3;
    default: return 0;
  }
}

function mapBackLabel(val) {
  switch (val) {
    case 1: return "Kurang";
    case 2: return "Baik";
    case 3: return "Sangat Baik";
    default: return "";
  }
}
