import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { getTargetsByStudent } from "../services/studentService";

export default function InputResultsDialog({ open, onClose, student, onSave }) {
  const [targets, setTargets] = useState([]);
  const [testDate, setTestDate] = useState("");
  const [selectedTests, setSelectedTests] = useState({}); // { test_name: { checked, score, unit, remarks } }

  // 🔹 Ambil target sesuai umur siswa
  useEffect(() => {
    if (student?.id) {
      getTargetsByStudent(student.id).then((data) => {
        setTargets(data || []);
        // inisialisasi state untuk semua test
        const init = {};
        (data || []).forEach((t) => {
          init[t.test_name] = {
            checked: false,
            score: "",
            unit: t.unit || "",
            remarks: "",
          };
        });
        setSelectedTests(init);
      });
    }
  }, [student]);

  // 🔹 Reset form setiap kali dialog ditutup
  useEffect(() => {
    if (!open) {
      setTestDate("");
      setTargets([]);
      setSelectedTests({});
    }
  }, [open]);

  const handleCheck = (test_name) => {
    setSelectedTests((prev) => ({
      ...prev,
      [test_name]: { ...prev[test_name], checked: !prev[test_name]?.checked },
    }));
  };

  const handleChange = (test_name, field, value) => {
    setSelectedTests((prev) => ({
      ...prev,
      [test_name]: { ...prev[test_name], [field]: value },
    }));
  };

  const handleSubmit = () => {
    const results = Object.entries(selectedTests)
      .filter(([_, val]) => val.checked && val.score !== "")
      .map(([test_name, val]) => ({
        student_id: student.id,
        test_name,
        score: val.score,
        unit: val.unit,
        remarks: val.remarks,
        test_date: testDate,
      }));

    if (!testDate) {
      alert("Harap pilih tanggal tes!");
      return;
    }

    if (results.length === 0) {
      alert("Pilih minimal satu tes dan isi nilainya!");
      return;
    }

    onSave(results); // kirim array hasil
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Input Hasil Tes untuk {student?.name}</DialogTitle>
      <DialogContent dividers>
        {/* Tanggal Tes */}
        <TextField
          fullWidth
          margin="dense"
          label="Tanggal Tes"
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {/* Daftar Tes */}
        {targets.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Tidak ada target untuk umur ini
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {targets.map((t) => (
              <React.Fragment key={t.test_name}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedTests[t.test_name]?.checked || false}
                        onChange={() => handleCheck(t.test_name)}
                      />
                    }
                    label={`${t.test_name} (Target: ${t.min_score} ${t.unit || ""})`}
                  />
                </Grid>

                {selectedTests[t.test_name]?.checked && (
                  <>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        margin="dense"
                        label="Nilai"
                        type="number"
                        value={selectedTests[t.test_name]?.score || ""}
                        onChange={(e) =>
                          handleChange(t.test_name, "score", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        margin="dense"
                        label="Satuan"
                        value={selectedTests[t.test_name]?.unit || ""}
                        onChange={(e) =>
                          handleChange(t.test_name, "unit", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        margin="dense"
                        label="Catatan"
                        value={selectedTests[t.test_name]?.remarks || ""}
                        onChange={(e) =>
                          handleChange(t.test_name, "remarks", e.target.value)
                        }
                      />
                    </Grid>
                  </>
                )}
              </React.Fragment>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSubmit} variant="contained">
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
        }
