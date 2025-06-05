import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const initialAirplanes = [
  { airplane_id: 1, model: "Airbus A320", capacity: 180, id: "7183" },
  { airplane_id: 2, model: "Boeing 737", capacity: 160, id: "e68b" }
];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function PlanesManagement() {
  const [data, setData] = useState(initialAirplanes);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('airplane_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ model: '', capacity: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.airplane_id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = [...selected, id];
    else newSelected = selected.filter((val) => val !== id);
    setSelected(newSelected);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  });
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleAddNew = () => {
    if (editingId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.airplane_id === editingId ? { ...item, ...formData } : item
        )
      );
    } else {
      const newId = data.length ? Math.max(...data.map(item => item.airplane_id)) + 1 : 1;
      setData([...data, { airplane_id: newId, ...formData, id: Math.random().toString(36).substr(2, 4) }]);
    }
    setFormData({ model: '', capacity: '' });
    setEditingId(null);
    setOpenModal(false);
  };

  const handleEdit = (row) => {
    setFormData({ model: row.model, capacity: row.capacity });
    setEditingId(row.airplane_id);
    setOpenModal(true);
  };

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setFormData({ model: '', capacity: '' }); setEditingId(null); setOpenModal(true); }}>
          Thêm máy bay
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredData.length}
                  checked={selected.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Mã máy bay</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.airplane_id);
              return (
                <TableRow
                  key={row.airplane_id}
                  hover
                  selected={isItemSelected}
                  onClick={() => handleClick(row.airplane_id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{row.airplane_id}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.capacity}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>{editingId !== null ? 'Chỉnh sửa máy bay' : 'Thêm máy bay mới'}</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Loại máy bay"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sức chứa"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={handleAddNew}>{editingId !== null ? 'Lưu' : 'Thêm'}</Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
