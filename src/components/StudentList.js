import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Stack,
  Typography,
  InputAdornment,
  TableSortLabel,
  TablePagination,
  useTheme,
} from "@mui/material";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onInput,
  onView,
}) {
  const theme = useTheme(); // akses light/dark mode
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Sorting
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sorted = [...students].sort((a, b) => {
    let valA = a[orderBy] || "";
    let valB = b[orderBy] || "";

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Search filter
  const filtered = sorted.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.parent_name || s.parentName || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Pagination
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Search bar */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          placeholder="Cari siswa atau orang tua..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              borderRadius: 50,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          maxHeight: 440,
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "white",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                { key: "name", label: "Nama" },
                { key: "age", label: "Usia" },
                { key: "gender", label: "Gender" },
                { key: "phone", label: "Telepon" },
                { key: "parent_name", label: "Orang Tua" },
              ].map((col) => (
                <TableCell
                  key={col.key}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
                    fontWeight: "bold",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : "asc"}
                    onClick={() => handleSort(col.key)}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      noWrap
                      sx={{ maxWidth: 140 }}
                    >
                      {col.label}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[900]
                      : theme.palette.grey[100],
                  fontWeight: "bold",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Aksi
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Belum ada data siswa
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : "inherit",
                  }}
                >
                  <TableCell noWrap title={student.name}>
                    {student.name}
                  </TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell noWrap title={student.phone}>
                    {student.phone}
                  </TableCell>
                  <TableCell noWrap title={student.parent_name || student.parentName}>
                    {student.parent_name || student.parentName}
                  </TableCell>
                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          px: 1.5,
                          fontSize: "0.75rem",
                        }}
                        onClick={() => onView(student)}
                      >
                        Info
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<ManageAccountsIcon />}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          px: 1.5,
                          fontSize: "0.75rem",
                        }}
                        onClick={() => onEdit(student)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        startIcon={<AssignmentIcon />}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          px: 1.5,
                          fontSize: "0.75rem",
                        }}
                        onClick={() => onInput(student)}
                      >
                        Input
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          px: 1.5,
                          fontSize: "0.75rem",
                        }}
                        onClick={() => onDelete(student.id)}
                      >
                        Hapus
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Tampilkan"
        sx={{ mt: 1 }}
      />
    </Box>
  );
}
