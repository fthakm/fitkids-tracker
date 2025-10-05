import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";
import StudentFilterBar from "./StudentFilterBar";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error("Gagal ambil data siswa:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAdd = async (formData) => {
    await addStudent(formData);
    setAdding(false);
    await loadStudents();
  };

  const handleUpdate = async (formData) => {
    await updateStudent(editing.id, formData);
    setEditing(null);
    await loadStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus siswa ini?")) return;
    await deleteStudent(id);
    await loadStudents();
  };

  const filtered = students.filter((s) => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase());
    const matchAge =
      ageFilter === "all" ||
      (ageFilter === "7-9" && s.age >= 7 && s.age <= 9) ||
      (ageFilter === "10-12" && s.age >= 10 && s.age <= 12) ||
      (ageFilter === "13-15" && s.age >= 13 && s.age <= 15);
    return matchSearch && matchAge;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Typography
          variant="h5"
          className="font-bold text-blue-600 tracking-wide"
        >
          Data Siswa
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAdding(true)}
          className="!bg-blue-600 hover:!bg-blue-700 !rounded-xl !shadow-md"
        >
          Tambah
        </Button>
      </div>

      {/* Filter Bar */}
      <StudentFilterBar
        search={search}
        onSearchChange={setSearch}
        ageFilter={ageFilter}
        onAgeChange={setAgeFilter}
        onAddStudent={() => setAdding(true)}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress color="primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Belum ada data siswa.
        </Typography>
      ) : (
        <Paper className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Usia</th>
                <th className="p-3 text-left">Gender</th>
                <th className="p-3 text-left">Telepon</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-blue-50 transition duration-150 border-b"
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.age}</td>
                  <td className="p-3">{s.gender}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3 flex gap-2">
                    <IconButton
                      onClick={() => setSelected(s)}
                      color="info"
                      size="small"
                      className="!text-blue-600 hover:!bg-blue-100"
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setEditing(s)}
                      color="primary"
                      size="small"
                      className="!text-blue-500 hover:!bg-blue-100"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(s.id)}
                      color="error"
                      size="small"
                      className="hover:!bg-red-100"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}

      {/* Add / Edit Form */}
      {(adding || editing) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[500px] shadow-lg">
            <StudentForm
              onSubmit={adding ? handleAdd : handleUpdate}
              initialData={editing || {}}
              onCancel={() => {
                setAdding(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[500px] shadow-lg">
            <StudentDetail
              student={selected}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
    }
