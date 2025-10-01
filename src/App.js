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

const ageGroups = ["6-8","9-11","12-15","16+"];

const targetData = {
  "6-8": { Skipping: 120, "Jump Squat": 35, "Shuttle Run 4x10": 11 },
  "9-11": { Skipping: 160, "Jump Squat": 40, "Shuttle Run 6x10": 15, "Sprint 20m": 5 },
  "12-15": { "Yo-Yo Test Lvl 15": 0, PushUp: 40, SitUp: 40, "Jump Squat": 30, Skipping: 190 },
  "16+": { "Yo-Yo Test Lvl 17": 0, PushUp: 45, SitUp: 50, "Jump Squat": 45, Skipping: 225 },
};

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentAge, setNewStudentAge] = useState("6-8");
  const [inputValues, setInputValues] = useState({});
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAgeFilter, setSelectedAgeFilter] = useState("6-8");

  const addStudent = () => {
    if(!newStudentName) return;
    const s = { name: newStudentName, age: newStudentAge, results: [], badge: "", notes: "" };
    setStudents([...students,s]);
    setNewStudentName("");
    setNewStudentAge("6-8");
  };

  const deleteStudent = (name) => setStudents(students.filter(s=>s.name!==name));

  const handleInput = (ex,value) => setInputValues({...inputValues,[ex]:Number(value)});

  const saveResults = () => {
    if(!selectedStudent) return;
    setStudents(students.map(s=>{
      if(s.name!==selectedStudent) return s;
      const results = Object.entries(inputValues).map(([ex,val])=>({
        date: new Date().toLocaleDateString(),
        exercise: ex,
        target: targetData[s.age][ex]||0,
        value: val
      }));
      const badge = results.every(r=>r.value>=r.target)?"✔":"❌";
      return {...s,results:[...s.results,...results],badge};
    }));
    setInputValues({});
  };

  const deleteResult = (studentName, date, exercise) => {
    setStudents(students.map(s=>{
      if(s.name!==studentName) return s;
      const results = s.results.filter(r=>!(r.date===date && r.exercise===exercise));
      return {...s,results};
    }));
  };

  const exportPDF = (student) => {
    const doc = new jsPDF();
    doc.text(`Laporan Latihan - ${student.name}`,14,20);
    doc.text(`Usia: ${student.age}`,14,30);
    doc.text(`Badge: ${student.badge||"-"}`,14,40);
    const rows = student.results.map(r=>[r.date,r.exercise,r.target,r.value,r.value>=r.target?"✔":"❌"]);
    autoTable(doc,{head:[["Tanggal","Latihan","Target","Hasil","Status"]],body:rows,startY:50});
    doc.save(`laporan_${student.name}.pdf`);
  };

  const exportExcel = (student) => {
    const ws = XLSX.utils.json_to_sheet(student.results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Latihan");
    XLSX.writeFile(wb,`laporan_${student.name}.xlsx`);
  };

  const chartData = (s) => ({
    labels: s.results.map(r=>r.exercise),
    datasets:[
      { label:"Hasil", data:s.results.map(r=>r.value), borderColor:"#4CAF50", backgroundColor:"#A8E6CF" },
      { label:"Target", data:s.results.map(r=>r.target), borderColor:"#FF5252", borderDash:[5,5], backgroundColor:"#FFCDD2" }
    ]
  });

  // --- Render Tabs --- //
  return (
    <div style={{padding:"15px"}}>
      <h1>📊 FitKids Tracker</h1>
      <div className="tabs">
        {["dashboard","leaderboard","list","input","manage"].map(t=>
          <div key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </div>
        )}
      </div>

      {/* --- TAB: Dashboard --- */}
      {tab==="dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <label>Filter Tanggal: </label>
          <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} />
          <div>
            {students.map(s=>{
              const results = s.results.filter(r=>r.date===new Date(filterDate).toLocaleDateString());
              if(results.length===0) return null;
              return (
                <div className="card" key={s.name}>
                  <h3>{s.name} ({s.age}) - Badge: {s.badge||"-"}</h3>
                  {results.map(r=>(
                    <div key={r.exercise}>
                      {r.exercise}: {r.value} (Target: {r.target}) 
                      <button onClick={()=>deleteResult(s.name,r.date,r.exercise)}>❌ Hapus</button>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* --- TAB: Leaderboard --- */}
      {tab==="leaderboard" && (
        <div>
          <h2>Leaderboard</h2>
          <ol>
            {students.sort((a,b)=>b.results.filter(r=>r.value>=r.target).length - a.results.filter(r=>r.value>=r.target).length).map(s=>
              <li key={s.name}>{s.name} ({s.age}) - ✔ {s.results.filter(r=>r.value>=r.target).length}</li>
            )}
          </ol>
        </div>
      )}

      {/* --- TAB: List Siswa --- */}
      {tab==="list" && (
        <div>
          <h2>List Siswa Berdasarkan Usia</h2>
          <label>Filter Usia: </label>
          <select value={selectedAgeFilter} onChange={e=>setSelectedAgeFilter(e.target.value)}>
            {ageGroups.map(a=><option key={a} value={a}>{a}</option>)}
          </select>
          {students.filter(s=>s.age===selectedAgeFilter).map(s=>(
            <div key={s.name} className="card">
              <h3 onClick={()=>setSelectedStudent(s.name)} style={{cursor:"pointer"}}>
                {s.name} - Badge: {s.badge||"-"}
              </h3>
              {selectedStudent===s.name && (
                <div>
                  <h4>Overview:</h4>
                  <div>
                    {s.results.length===0?"Belum ada hasil":s.results.map(r=>(
                      <div key={r.date+"-"+r.exercise}>
                        {r.date} | {r.exercise}: {r.value} (Target: {r.target}) 
                        <button onClick={()=>deleteResult(s.name,r.date,r.exercise)}>❌</button>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:"10px"}}>
                    <button onClick={()=>exportPDF(s)}>📄 Export PDF</button>
                    <button onClick={()=>exportExcel(s)}>📊 Export Excel</button>
                  </div>
                  <div style={{marginTop:"10px"}}>
                    <Line data={chartData(s)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* --- TAB: Input Nilai --- */}
      {tab==="input" && (
        <div>
          <h2>Input Nilai</h2>
          <label>Pilih Siswa: </label>
          <select value={selectedStudent} onChange={e=>setSelectedStudent(e.target.value)}>
            <option value="">--Pilih--</option>
            {students.map(s=><option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          {selectedStudent && (
            <div>
              {Object.keys(targetData[students.find(s=>s.name===selectedStudent).age]).map(ex=>(
                <div key={ex}>
                  <label>{ex} (Target: {targetData[students.find(s=>s.name===selectedStudent).age][ex]}): </label>
                  <input type="number" value={inputValues[ex]||""} onChange={e=>handleInput(ex,e.target.value)} />
                </div>
              ))}
              <button onClick={saveResults}>💾 Simpan</button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: Manage Siswa --- */}
      {tab==="manage" && (
        <div>
          <h2>Tambah / Hapus Siswa</h2>
          <div>
            <input placeholder="Nama Siswa" value={newStudentName} onChange={e=>setNewStudentName(e.target.value)} />
            <select value={newStudentAge} onChange={e=>setNewStudentAge(e.target.value)}>
              {ageGroups.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
            <button onClick={addStudent}>➕ Tambah</button>
          </div>
          <div style={{marginTop:"15px"}}>
            <h3>Daftar Siswa:</h3>
            {students.map(s=>(
              <div key={s.name}>
                {s.name} ({s.age}) <button onClick={()=>deleteStudent(s.name)}>❌ Hapus</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .tabs { display:flex; gap:10px; margin-bottom:15px; }
        .tab { padding:5px 10px; border:1px solid #ccc; cursor:pointer; border-radius:5px; }
        .tab.active { background:#4CAF50; color:white; border-color:#4CAF50; }
        .card { border:1px solid #ccc; border-radius:5px; padding:10px; margin-bottom:10px; }
        button { margin-left:5px; }
      `}</style>
    </div>
  );
        }
