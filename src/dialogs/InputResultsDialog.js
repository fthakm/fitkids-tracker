import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const targetData = {
  "6-8": { Skipping: 120, "Jump Squat": 35, "Shuttle Run 4x10": 11, "Yo-Yo Test Lvl 10": 0 },
  "9-11": { Skipping: 160, "Jump Squat": 40, "Shuttle Run 6x10": 15, "Sprint 20m": 5, "Yo-Yo Test Lvl 12": 0 },
  "12-15": { "Yo-Yo Test Lvl 15": 0, PushUp: 40, SitUp: 40, "Jump Squat": 30, Skipping: 190 },
  "16+": { "Yo-Yo Test Lvl 17": 0, PushUp: 45, SitUp: 50, "Jump Squat": 45, Skipping: 225 }
};

export default function InputResultsDialog({ student, setStudents, onClose, showSnackbar }) {
  const [inputResults, setInputResults] = useState({});

  const handleSave = () => {
    const exercises = Object.keys(targetData[student.age]);
    for (const ex of exercises) {
      if (inputResults[ex] === undefined || inputResults[ex] === "") {
        showSnackbar(`Nilai ${ex} wajib diisi`, "error");
        return;
      }
    }

    const date = new Date().toISOString().split("T")[0];
    const results = exercises.map(ex => ({
      date,
      exercise: ex,
      target: targetData[student.age][ex],
      value: Number(inputResults[ex])
    }));

    const badge = results.every(r => r.value >= r.target) ? "✔" : "❌";

    setStudents(prev =>
      prev.map(s => (s.id === student.id ? { ...s, results: [...(s.results || []), ...results], badge } : s))
    );

    showSnackbar("Nilai tersimpan");
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Input Nilai - {student.name}</DialogTitle>
      <DialogContent>
        {Object.keys(targetData[student.age]).map(ex => (
          <TextField
            key={ex}
            label={`${ex} (Target: ${targetData[student.age][ex]})`}
            type="number"
            fullWidth
            margin="dense"
            value={inputResults[ex] ?? ""}
            onChange={e => setInputResults({ ...inputResults, [ex]: e.target.value })}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSave}>Simpan</Button>
      </DialogActions>
    </Dialog>
  );
                    }
