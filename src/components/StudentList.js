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
  useMediaQuery,
  Collapse,
  IconButton,
} from "@mui/material";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function StudentList({
  students,
  onEdit,
  onDelete,
  onInput,
  onView,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState(null);

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
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

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
                        {student.name}
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
                      </TableCell>
                      <TableCell>{student.age}</TableCell>
                      {!isMobile && <TableCell>{student.gender}</TableCell>}
                      {!isMobile && <TableCell>{student.phone}</TableCell>}
                      {!isMobile && (
                        <TableCell>{student.parent_name || student.parentName}</TableCell>
                      )}
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
                            onClick={() => onView(student)}
                          >
                            Info
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<ManageAccountsIcon />}
                            onClick={() => onEdit(student)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<AssignmentIcon />}
                            onClick={() => onInput(student)}
                          >
                            Input
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => onDelete(student.id)}
                          >
                            Hapus
                          </Button>
                        </Stack>
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
