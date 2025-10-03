import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import EvaluationList from "../components/EvaluationList";
import EvaluationDetail from "../components/EvaluationDetail";
import EvaluationInput from "../components/EvaluationInput";
import AddEvaluationDialog from "../dialogs/AddEvaluationDialog";
import { getEvaluations, addEvaluation, updateEvaluation } from "../services/evaluationService";
import { getStudents } from "../services/studentService"; // asumsi sudah ada

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const evals = await getEvaluations();
      setEvaluations(evals);
      const stds = await getStudents();
      setStudents(stds);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleAddEvaluation = async (data) => {
    const newEval = await addEvaluation({
      date: data.date,
      student_id: null,
      student_name: null,
      results: [],
    });
    setEvaluations([newEval, ...evaluations]);
    setDialogOpen(false);
  };

  const handleSubmitResult = async (resultData) => {
    const updated = {
      ...selectedEvaluation,
      student_id: resultData.studentId,
      student_name: resultData.studentName,
      results: resultData.results,
    };
    await addEvaluation(updated);
    fetchData();
    setSelectedEvaluation(updated);
  };

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Kiri: daftar evaluasi */}
        <Grid item xs={12} md={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Daftar Evaluasi</Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Tambah
            </Button>
          </Box>
          <EvaluationList evaluations={evaluations} onSelect={setSelectedEvaluation} />
        </Grid>

        {/* Kanan: detail & input */}
        <Grid item xs={12} md={7}>
          {selectedEvaluation ? (
            <Box>
              <EvaluationDetail evaluation={selectedEvaluation} />

              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Input Nilai Evaluasi
                </Typography>

                {/* Pilih siswa */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Pilih Siswa</InputLabel>
                  <Select
                    value={selectedStudent?.id || ""}
                    onChange={(e) =>
                      setSelectedStudent(students.find((s) => s.id === e.target.value))
                    }
                  >
                    {students.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name} (usia {s.age})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Tampilkan form kalau sudah pilih siswa */}
                {selectedStudent && (
                  <EvaluationInput
                    student={selectedStudent}
                    onSubmit={handleSubmitResult}
                  />
                )}
              </Box>
            </Box>
          ) : (
            <Typography>Pilih evaluasi untuk melihat detail</Typography>
          )}
        </Grid>
      </Grid>

      {/* Dialog tambah evaluasi */}
      <AddEvaluationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddEvaluation}
      />
    </Box>
  );
    }
