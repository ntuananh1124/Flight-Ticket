import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const headCells = [
  { id: 'airline_id', label: 'ID' },
  { id: 'name', label: 'Tên' },
  { id: 'image', label: 'Logo' },
  { id: 'description', label: 'Mô tả' },
  { id: 'actions', label: 'Hành động' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function AirlinesManagement() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('airline_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newAirline, setNewAirline] = useState({
    name: '', image: '', description: ''
  });

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/airlines');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi khi fetch airlines:', error);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) setSelected(data.map((n) => n.airline_id));
    else setSelected([]);
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

  const handleEdit = (id) => {
    setEditingId(id);
    const row = data.find((item) => item.airline_id === id);
    setEditedRow({ ...row });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/airlines/${editingId}`, editedRow);
      await fetchAirlines();
      alert('Cập nhật thành công!');
      setEditingId(null);
    } catch (error) {
      alert('Cập nhật không thành công!');
      console.error('Lỗi khi cập nhật airline:', error);
    }
  };

  const handleInputChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewAirline({ ...newAirline, [name]: value });
  };

  const handleAddAirline = async () => {
    const { name, image, description } = newAirline;
    if (!name || !image || !description) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/airlines', newAirline);
      await fetchAirlines();

      alert('Thêm mới thành công !');
      setOpenModal(false);
      setNewAirline({ name: '', image: '', description: '' });
    } catch (error) {
      alert('Thêm không thành công !');
      console.error('Lỗi khi thêm airline:', error);
    }
  };

  const isSelected = (id) => selected.includes(id);

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedData = filteredData.sort(getComparator(order, orderBy));
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Thêm hãng
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
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  {headCell.id !== 'actions' ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={(e) => handleRequestSort(e, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.airline_id);
              const isEditing = editingId === row.airline_id;
              return (
                <TableRow
                  key={row.airline_id}
                  hover
                  selected={isItemSelected}
                  onClick={() => handleClick(row.airline_id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{row.airline_id}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedRow.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        size="small"
                      />
                    ) : row.name}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedRow.image}
                        onChange={(e) => handleInputChange(e, 'image')}
                        size="small"
                      />
                    ) : (
                      <Avatar src={`${row.image}`} alt={row.name} variant="rounded" />
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedRow.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                        size="small"
                        fullWidth
                      />
                    ) : row.description}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(row.airline_id)}><EditIcon /></IconButton>
                    )}
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
          <Typography variant="h6" mb={2}>Thêm hãng hàng không</Typography>
          <TextField
            name="name"
            label="Tên hãng hàng không"
            fullWidth
            margin="normal"
            value={newAirline.name}
            onChange={handleModalChange}
          />
          <TextField
            name="image"
            label="Link ảnh logo (image)"
            fullWidth
            margin="normal"
            value={newAirline.image}
            onChange={handleModalChange}
          />
          <TextField
            name="description"
            label="Mô tả"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newAirline.description}
            onChange={handleModalChange}
          />
          <Button fullWidth variant="contained" onClick={handleAddAirline} sx={{ mt: 2 }}>
            Lưu
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}
