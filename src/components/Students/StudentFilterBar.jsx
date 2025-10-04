import React from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function StudentFilterBar({
  search,
  onSearchChange,
  ageFilter,
  onAgeChange,
  onAddStudent,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <TextField
          label="Cari Siswa..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          className="w-full md:w-64 bg-white rounded-md"
        />
        <TextField
          select
          label="Filter Usia"
          value={ageFilter}
          onChange={(e) => onAgeChange(e.target.value)}
          size="small"
          className="w-full md:w-48 bg-white rounded-md"
        >
          <MenuItem value="all">Semua Usia</MenuItem>
          <MenuItem value="7-9">7 - 9 Tahun</MenuItem>
          <MenuItem value="10-12">10 - 12 Tahun</MenuItem>
          <MenuItem value="13-15">13 - 15 Tahun</MenuItem>
        </TextField>
      </div>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddStudent}
        className="whitespace-nowrap"
      >
        Tambah Siswa
      </Button>
    </div>
  );
}
