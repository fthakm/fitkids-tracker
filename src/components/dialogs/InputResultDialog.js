import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Snackbar } from "@mui/material";

export default function InputResultsDialog({ open, onClose, student, targetData, onSave }) {
  const [inputResults, setInputResults] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (student) {
      const exs = Object.keys(targetData[student.age] || {});
      const initial = {};
      exs.forEach(ex => initial[ex] = "");
      setInputResults(initial);
    }
  }, [student, targetData]);

  const handleSave = () => {
    if (!student) return;

    // Validasi
    for (const ex in inputResults) {
      if (inputResults[ex] === "" || inputResults[ex] === undefined) {
        setSnackbar({ open: true, message: `Nilai ${ex} wajib diisi`, severity: "error" });
        return;
      }
    }

    // Buat array results
    const date = new Date().toISOString().split("T")[0];
    const results = Object.keys(inputResults).map(ex => ({
      date,
      exercise: ex,
      target: targetData[student.age][ex],
      value: Number(inputResults[ex])
    }));

    onSave(student, results);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Input Nilai untuk {student?.name}</DialogTitle>
        <DialogContent>
          {student && Object.keys(targetData[student.age]).map(ex => (
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
