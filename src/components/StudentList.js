import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, Stack, Typography, InputAdornment,
  TableSortLabel, TablePagination, useTheme, useMediaQuery, Collapse,
  IconButton, Menu, MenuItem, Select, FormControl, InputLabel,
} from "@mui/material";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onInput,
  onView,
  onAdd,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null);

  // filter usia
  const [ageFilter, setAgeFilter] = useState("");

  // menu mobile aksi
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

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

  // Search + filter
  const filtered = sorted.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.parent_name || s.parentName || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchAge = ageFilter ? s.age === parseInt(ageFilter, 10) : true;
    return matchSearch && matchAge;
  });

  // Pagination
  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Baris kontrol atas */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 2 }}
      >
        {/* Tombol tambah */}
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: 0 }}
        >
          Tambah Siswa
        </Button>

        {/* Filter usia */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter Usia</InputLabel>
          <Select
            value={ageFilter}
            label="Filter Usia"
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="6">6</MenuItem>
            <MenuItem value="7">7</MenuItem>
            <MenuItem value="8">8</MenuItem>
            <MenuItem value="9">9</MenuItem>
            <MenuItem value="10">10</MenuItem>
          </Select>
        </FormControl>

        {/* Search */}
        <TextField
          placeholder="Cari siswa atau orang tua..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 280 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

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
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Nama
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "age"}
                  direction={orderBy === "age" ? order : "asc"}
                  onClick={() => handleSort("age")}
                >
                  Usia
                </TableSortLabel>
              </TableCell>
              {!isMobile && <TableCell>Gender</TableCell>}
              {!isMobile && <TableCell>Telepon</TableCell>}
              {!isMobile && <TableCell>Orang Tua</TableCell>}
              <TableCell align="center">Aksi</TableCell>
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
              paginated.map((student) => {
                const isExpanded = expandedRow === student.id;
                return (
                  <React.Fragment key={student.id}>
                    <TableRow hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography>{student.name}</Typography>
                          {isMobile && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : student.id)
                              }
                            >
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{student.age}</TableCell>
                      {!isMobile && <TableCell>{student.gender}</TableCell>}
                      {!isMobile && <TableCell>{student.phone}</TableCell>}
                      {!isMobile && (
                        <TableCell>
                          {student.parent_name || student.parentName}
                        </TableCell>
                      )}
                      <TableCell align="center">
                        {isMobile ? (
                          <>
                            <IconButton onClick={(e) => handleMenuOpen(e, student)}>
                              <MoreVertIcon />
                            </IconButton>
                          </>
                        ) : (
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
                              onClick={() => onView(student)}
                              sx={{ borderRadius: 0, minWidth: 100 }}
                            >
                              Info
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<ManageAccountsIcon />}
                              onClick={() => onEdit(student)}
                              sx={{ borderRadius: 0, minWidth: 100 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              startIcon={<AssignmentIcon />}
                              onClick={() => onInput(student)}
                              sx={{ borderRadius: 0, minWidth: 100 }}
                            >
                              Input
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => onDelete(student.id)}
                              sx={{ borderRadius: 0, minWidth: 100 }}
                            >
                              Hapus
                            </Button>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Collapse untuk mobile */}
                    {isMobile && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0 }}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: "action.hover" }}>
                              <Typography variant="body2">
                                <b>Gender:</b> {student.gender}
                              </Typography>
                              <Typography variant="body2">
                                <b>Telepon:</b> {student.phone}
                              </Typography>
                              <Typography variant="body2">
                                <b>Orang Tua:</b>{" "}
                                {student.parent_name || student.parentName}
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
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

      {/* Menu mobile */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { onView(selectedStudent); handleMenuClose(); }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Info
        </MenuItem>
        <MenuItem onClick={() => { onEdit(selectedStudent); handleMenuClose(); }}>
          <ManageAccountsIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { onInput(selectedStudent); handleMenuClose(); }}>
          <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> Input
        </MenuItem>
        <MenuItem onClick={() => { onDelete(selectedStudent.id); handleMenuClose(); }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Hapus
        </MenuItem>
      </Menu>
    </Box>
  );
                        }
