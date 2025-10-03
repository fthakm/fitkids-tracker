import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard({ students }) {
  const [results, setResults] = useState([]);
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    loadData();
  }, [students]);

  async function loadData() {
    const { data: res } = await supabase.from("results").select("*");
    setResults(res || []);

    const { data: tgs } = await supabase.from("targets").select("*");
    setTargets(tgs || []);
  }

  function evaluate(studentId) {
    const studentResults = results.filter(r => r.student_id === studentId);

    return studentResults.map(r => {
      const target = targets.find(t => t.test_name === r.test_name);
      if (!target) return { ...r, status: "❓ Belum ada target" };

      if (r.score >= target.min_score) {
        return { ...r, status: "✅ Lulus", recommendation: "Pertahankan!" };
      } else {
        return {
          ...r,
          status: "❌ Belum Lulus",
          recommendation: `Latihan tambahan untuk ${r.test_name}`,
        };
      }
    });
  }

  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg mb-2">📋 Dashboard</h2>
      {students.map(s => (
        <div key={s.id} className="border p-2 mb-3 rounded">
          <p className="font-semibold">
            {s.name} ({s.gender}) - {s.address}
          </p>
          <p className="text-sm">Lahir: {s.birthdate}</p>

          <ul className="mt-2">
            {evaluate(s.id).map(r => (
              <li key={r.id}>
                {r.test_name}: {r.score} → {r.status} <br />
                <span className="text-sm text-gray-600">
                  {r.recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
