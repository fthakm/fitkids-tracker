import React from "react";
import { TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button, Stack } from "@mui/material";
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
    <div className="flex flex-wrap gap-3 justify-between items-center">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField
          placeholder="Cari siswa..."
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
          sx={{ width: { xs: "100%", sm: 240 } }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Filter Usia</InputLabel>
          <Select
            value={ageFilter}
            label="Filter Usia"
            onChange={(e) => onAgeChange(e.target.value)}
          >
            <MenuItem value="all">Semua</MenuItem>
            <MenuItem value="7-9">7-9 tahun</MenuItem>
            <MenuItem value="10-12">10-12 tahun</MenuItem>
            <MenuItem value="13-15">13-15 tahun</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={onAddStudent}
        sx={{ borderRadius: 1 }}
      >
        Tambah Siswa
      </Button>
    </div>
  );
}
