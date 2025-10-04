import React, { useEffect, useState } from "react";
import { Button, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { getStudents } from "../../services/studentService";
import { saveLatihanSession } from "../../services/latihanService";

export default function LatihanForm({ onClose, onSaved }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [exerciseType, setExerciseType] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  const toggleStudent = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await saveLatihanSession({ exerciseType, date, students: selected });
    setLoading(false);
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6" className="font-bold text-blue-600">
        Tambah Sesi Latihan
      </Typography>

      <TextField
        label="Jenis Latihan"
        value={exerciseType}
        onChange={(e) => setExerciseType(e.target.value)}
        fullWidth
        required
      />

      <TextField
        type="date"
        label="Tanggal"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        required
      />

      <div className="border p-3 rounded-lg h-48 overflow-y-auto">
        <Typography variant="subtitle1" className="font-semibold mb-2">
          Pilih Siswa yang Hadir
        </Typography>
        {students.map((s) => (
          <FormControlLabel
            key={s.id}
            control={
              <Checkbox
                checked={selected.includes(s.id)}
                onChange={() => toggleStudent(s.id)}
              />
            }
            label={s.name}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
