import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

const headCells = [
  { id: 'airplane_id', label: 'ID' },
  { id: 'model', label: 'Loại' },
  { id: 'capacity', label: 'Sức chứa' },
  { id: 'actions', label: 'Hành động' }
];

export default function PlanesManagement() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('airplane_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ model: '', capacity: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAirplanes();
  }, []);

  const fetchAirplanes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/airplanes');
      setData(res.data);
    } catch (err) {
      console.error('Lỗi khi fetch máy bay:', err);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) setSelected(data.map((n) => n.airplane_id));
    else setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = selectedIndex === -1 ? [...selected, id] : selected.filter((val) => val !== id);
    setSelected(newSelected);
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEdit = (row) => {
    setFormData({ model: row.model, capacity: row.capacity });
    setEditingId(row.airplane_id);
    setOpenModal(true);
  };

  const handleAddOrUpdate = async () => {
    const { model, capacity } = formData;

    if (!model || !capacity || capacity <= 0) {
      alert('Vui lòng nhập đầy đủ và hợp lệ.');
      return;
    }

    try {
      if (editingId !== null) {
        await axios.put(`http://localhost:5000/api/airplanes/${editingId}`, {
          model, capacity: parseInt(capacity)
        });
      } else {
        await axios.post('http://localhost:5000/api/airplanes', {
          model, capacity: parseInt(capacity)
        });
      }

      await fetchAirplanes();
      alert("Cập nhật thành công !");
      setFormData({ model: '', capacity: '' });
      setEditingId(null);
      setOpenModal(false);
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật máy bay:', error);
    }
  };

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => {
          setFormData({ model: '', capacity: '' });
          setEditingId(null);
          setOpenModal(true);
        }}>
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
              {headCells.map((cell) => (
                <TableCell key={cell.id}>
                  {cell.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={orderBy === cell.id ? order : 'asc'}
                      onClick={(e) => handleRequestSort(e, cell.id)}
                    >
                      {cell.label}
                    </TableSortLabel>
                  ) : cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.airplane_id);
              return (
                <TableRow key={row.airplane_id} hover selected={isItemSelected} onClick={() => handleClick(row.airplane_id)}>
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
            label="Loại máy bay"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Sức chứa"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            margin="normal"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={handleAddOrUpdate}>
              {editingId !== null ? 'Lưu' : 'Thêm'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
}
