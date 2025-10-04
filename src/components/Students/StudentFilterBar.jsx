import React from "react";
import { TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export default function StudentFilterBar({
  search,
  onSearchChange,
  ageFilter,
  onAgeChange,
  onAddStudent,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
      {/* Tombol Tambah */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddStudent}
        className="!rounded-none"
      >
        Tambah Siswa
      </Button>

      {/* Filter Usia */}
      <FormControl size="small" className="min-w-[120px]">
        <InputLabel>Filter Usia</InputLabel>
        <Select
          value={ageFilter}
          label="Filter Usia"
          onChange={(e) => onAgeChange(e.target.value)}
        >
          <MenuItem value="">Semua</MenuItem>
          {[6, 7, 8, 9, 10, 11, 12].map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Pencarian */}
      <TextField
        placeholder="Cari siswa atau orang tua..."
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        className="sm:w-[280px] w-full"
      />
    </div>
  );
}
