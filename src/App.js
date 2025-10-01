import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import * as XLSX from "xlsx";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- Komponen UI --- //
const Button = ({ children, ...props }) => (
  <button {...props} style={{ padding: "8px", margin: "4px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px" }}>
    {children}
  </button>
);

const Card = ({ children, style }) => (
  <div style={{ background: "#fff", padding: "12px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "12px", ...style }}>
    {children}
  </div>
);

// --- Target Latihan --- //
const targetData = {
  "6-8": { Skipping: 120, "Jump Squat": 35, "Shuttle Run 4x10": 11 },
  "9-11": { Skipping: 160, "Jump Squat": 40, "Shuttle Run 6x10": 15, "Sprint 20m": 5 },
  "12-15": { "Yo-Yo Test Lvl 15": 0, PushUp: 40, SitUp: 40, "Jump Squat": 30, Skipping: 190 },
  "16+": { "Yo-Yo Test Lvl 17": 0, PushUp: 45, SitUp: 50, "Jump Squat": 45, Skipping: 225 },
};

// --- App --- //
export default function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [ageGroup, setAgeGroup] = useState("6-8");
  const [inputValues, setInputValues] = useState({});

  const addStudent = () => {
    if (!newStudentName) return;
    const student = { name: newStudentName, ageGroup, results: [], badge: "" };
    setStudents([...students, student]);
    setSelectedStudent(newStudentName);
    setNewStudentName("");
    setInputValues({});
  };

  const handleInput = (exercise, value) => {
    setInputValues({ ...inputValues, [exercise]: Number(value) });
  };

  const saveResults = () => {
    setStudents(students.map(s => {
      if (s.name !== selectedStudent) return s;
      const results = Object.entries(inputValues).map(([ex, val]) => ({
        date: new Date().toLocaleDateString(),
        exercise: ex,
        target: targetData[s.ageGroup][ex] || 0,
        value: val
      }));
      const badge = results.every(r => r.value >= r.target) ? "✔" : "❌";
      return { ...s, results, badge };
    }));
  };

  const exportPDF = (student) => {
    const doc = new jsPDF();
    doc.text(`Laporan Latihan - ${student.name}`, 14, 20);
    doc.text(`Usia: ${student.ageGroup}`, 14, 30);
    doc.text(`Badge: ${student.badge || "-"}`, 14, 40);
    const rows = student.results.map(r => [r.date, r.exercise, r.target, r.value, r.value >= r.target ? "✔" : "❌"]);
    autoTable(doc, { head: [["Tanggal", "Latihan", "Target", "Hasil", "Status"]], body: rows, startY: 50 });
    doc.save(`laporan_${student.name}.pdf`);
  };

  const exportExcel = (student) => {
    const ws = XLSX.utils.json_to_sheet(student.results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Latihan");
    XLSX.writeFile(wb, `laporan_${student.name}.xlsx`);
  };

  const chartData = () => {
    if (!selectedStudent) return {};
    const s = students.find(st => st.name === selectedStudent);
    if (!s) return {};
    return {
      labels: s.results.map(r => r.exercise),
      datasets: [{
        label: "Hasil",
        data: s.results.map(r => r.value),
        borderColor: "#4CAF50",
        backgroundColor: "#A8E6CF"
      }, {
        label: "Target",
        data: s.results.map(r => r.target),
        borderColor: "#FF5252",
        borderDash: [5,5],
        backgroundColor: "#FFCDD2"
      }]
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 FitKids Tracker</h1>

      {/* Tambah Siswa */}
      <Card>
        <h2>Tambah Siswa</h2>
        <input placeholder="Nama siswa" value={newStudentName} onChange={e=>setNewStudentName(e.target.value)} />
        <select value={ageGroup} onChange={e=>setAgeGroup(e.target.value)}>
          {Object.keys(targetData).map(a=> <option key={a} value={a}>{a}</option>)}
        </select>
        <Button onClick={addStudent}>➕ Tambah</Button>
      </Card>

      {/* Pilih Siswa */}
      {students.length>0 && (
        <Card>
          <h2>Pilih Siswa</h2>
          <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
            <option value="">-- Pilih --</option>
            {students.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </Card>
      )}

      {/* Input Latihan */}
      {selectedStudent && (
        <Card>
          <h2>Input Latihan</h2>
          {Object.keys(targetData[students.find(s=>s.name===selectedStudent).ageGroup]).map(ex => (
            <div key={ex} style={{ marginBottom: "8px" }}>
              <label>{ex} (Target {targetData[students.find(s=>s.name===selectedStudent).ageGroup][ex]}): </label>
              <input type="number" onChange={e=>handleInput(ex,e.target.value)} />
            </div>
          ))}
          <Button onClick={saveResults}>💾 Simpan Hasil</Button>
        </Card>
      )}

      {/* Grafik */}
      {selectedStudent && students.find(s=>s.name===selectedStudent).results.length>0 && (
        <Card>
          <h2>📈 Grafik Perkembangan</h2>
          <Line data={chartData()} />
        </Card>
      )}

      {/* Laporan */}
      {selectedStudent && students.find(s=>s.name===selectedStudent).results.length>0 && (
        <Card>
          <h2>Laporan</h2>
          <Button onClick={()=>exportPDF(students.find(s=>s.name===selectedStudent))}>📑 Export PDF</Button>
          <Button onClick={()=>exportExcel(students.find(s=>s.name===selectedStudent))}>📊 Export Excel</Button>
        </Card>
      )}
    </div>
  );
        }
