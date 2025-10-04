import React from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function StudentFilterBar({
  search,
  setSearch,
  ageFilter,
  setAgeFilter,
}) {
  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm items-center">
      <TextField
        size="small"
        placeholder="Cari nama siswa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{ flex: 1, minWidth: 220 }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Filter Usia</InputLabel>
        <Select
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
          label="Filter Usia"
        >
          <MenuItem value="all">Semua</MenuItem>
          <MenuItem value="7-9">7–9 Tahun</MenuItem>
          <MenuItem value="10-12">10–12 Tahun</MenuItem>
          <MenuItem value="13-15">13–15 Tahun</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
