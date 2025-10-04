import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { getStudents } from "../../services/studentService";
import { addLatihan } from "../../services/latihanService";

export default function LatihanForm({ onClose, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    target: "",
    participants: [],
  });

  useEffect(() => {
    getStudents().then(setStudents).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLatihan(form);
    onSuccess();
  };

  const toggleStudent = (id) => {
    setForm((prev) => {
      const isSelected = prev.participants.includes(id);
      return {
        ...prev,
        participants: isSelected
          ? prev.participants.filter((sid) => sid !== id)
          : [...prev.participants, id],
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6" className="text-blue-600 font-semibold">
        Tambah Data Latihan
      </Typography>

      <TextField
        label="Tanggal Latihan"
        type="date"
        name="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        fullWidth
        required
      />
      <TextField
        label="Jenis Latihan"
        name="type"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        fullWidth
        required
      />
      <TextField
        label="Target Nilai"
        name="target"
        value={form.target}
        onChange={(e) => setForm({ ...form, target: e.target.value })}
        fullWidth
      />

      <div className="max-h-48 overflow-auto border rounded-md p-2">
        <Typography variant="subtitle1" className="text-gray-700 font-medium mb-2">
          Pilih Siswa yang Hadir:
        </Typography>
        {students.map((s) => (
          <FormControlLabel
            key={s.id}
            control={
              <Checkbox
                checked={form.participants.includes(s.id)}
                onChange={() => toggleStudent(s.id)}
              />
            }
            label={s.name}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outlined" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Simpan
        </Button>
      </div>
    </form>
  );
                                  }
