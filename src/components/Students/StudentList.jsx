Aditya, [10/4/2025 3:43 PM]
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Collapse,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onInput,
  onView,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredStudents = students
    .filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
    .filter((s) => {
      if (ageFilter === "all") return true;
      if (ageFilter === "7-9") return s.age >= 7 && s.age <= 9;
      if (ageFilter === "10-12") return s.age >= 10 && s.age <= 12;
      if (ageFilter === "13-15") return s.age >= 13 && s.age <= 15;
      return true;
    });

  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <Typography variant="h5" className="font-bold text-blue-700">
        Daftar Siswa
      </Typography>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm items-center">
        <TextField
          size="small"
          placeholder="Cari nama siswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Tabel */}
      <TableContainer
        component={Paper}
        className="shadow-md rounded-xl overflow-hidden"
      >
        <Table>
          <TableHead className="bg-blue-600">
            <TableRow>
              <TableCell className="text-white font-semibold">Nama</TableCell>
              <TableCell className="text-white font-semibold">Usia</TableCell>
              <TableCell className="text-white font-semibold hidden md:table-cell">
                Gender
              </TableCell>
              <TableCell className="text-white font-semibold hidden md:table-cell">
                Telepon
              </TableCell>

Aditya, [10/4/2025 3:43 PM]
<TableCell className="text-white font-semibold hidden md:table-cell">
                Orang Tua
              </TableCell>
              <TableCell align="center" className="text-white font-semibold">
                Aksi
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" className="p-6">
                  Belum ada data siswa
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <React.Fragment key={student.id}>
                  <TableRow hover>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{student.name}</span>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleExpand(student.id)}
                        >
                          {expandedRow === student.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </div>
                    </TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.gender}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.parent_name || student.parentName}
                    </TableCell>

                    {/* Tombol Aksi */}
                    <TableCell align="center">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <Button
                          onClick={() => onView(student)}
                          variant="outlined"
                          color="info"
                          size="small"
                          sx={{ textTransform: "none", minWidth: "95px" }}
                          startIcon={<VisibilityIcon />}
                        >
                          Info
                        </Button>
                        <Button
                          onClick={() => onEdit(student)}
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ textTransform: "none", minWidth: "95px" }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => onInput(student)}
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{ textTransform: "none", minWidth: "95px" }}
                          startIcon={<AssignmentIcon />}
                        >
                          Nilai
                        </Button>
                        <Button
                          onClick={() => onDelete(student.id)}
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ textTransform: "none", minWidth: "95px" }}
                          startIcon={<DeleteIcon />}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

Aditya, [10/4/2025 3:43 PM]
{/* Collapse detail for mobile */}
                  <TableRow className="md:hidden bg-gray-50">
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse
                        in={expandedRow === student.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <div className="p-4 space-y-1 text-sm">
                          <p>
                            <strong>Gender:</strong> {student.gender}
                          </p>
                          <p>
                            <strong>Telepon:</strong> {student.phone}
                          </p>
                          <p>
                            <strong>Orang Tua:</strong>{" "}
                            {student.parent_name || student.parentName}
                          </p>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Baris per halaman"
      />
    </div>
  );
}
