import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function AddEvaluationDialog({ open, onClose, onSave }) {
  const [date, setDate] = useState("");

  const handleSave = () => {
    onSave({ date });
    setDate("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Buat Evaluasi Baru</DialogTitle>
      <DialogContent>
        <TextField
          label="Tanggal"
          type="date"
          fullWidth
          margin="dense"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleSave} variant="contained">Simpan</Button>
      </DialogActions>
    </Dialog>
  );
}
