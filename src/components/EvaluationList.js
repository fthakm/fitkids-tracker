import { useEffect, useState } from "react";
import { getEvaluationsByStudent } from "../services/evaluationsService";
import { Card, CardContent } from "@mui/material";

export default function EvaluationList({ student, onSelect }) {
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
        <CardContent>Pilih siswa untuk melihat evaluasi</CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Daftar Evaluasi {student.name}</h2>
      {evaluations.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada evaluasi</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Jumlah Tes</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev, i) => (
              <tr key={i}>
                <td className="border p-2">{ev.date}</td>
                <td className="border p-2">{ev.results?.length || 0}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => onSelect(ev)}
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
        }
        
