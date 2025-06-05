import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const initialData = [
  {
    airline_id: 1,
    name: "Vietnam Airlines",
    image: "https://i.postimg.cc/13dQm0PL/vietnam-airlines.png",
    description: "Vietnam Airlines là hãng hàng không quốc gia, cung cấp dịch vụ bay nội địa và quốc tế chất lượng cao.",
    id: "6c87"
  },
  {
    airline_id: 2,
    name: "Qatar Airways",
    image: "https://i.postimg.cc/R0nzN3Zq/qatar-airways.jpg",
    description: "Qatar Airways là hãng hàng không quốc tế nổi tiếng với dịch vụ cao cấp, trụ sở tại Doha, Qatar.",
    id: "553e"
  },
  {
    airline_id: 3,
    name: "Bamboo Airways",
    image: "https://i.postimg.cc/L6HRN6N0/bamboo-airways.jpg",
    description: "Bamboo Airways là hãng hàng không tư nhân của Việt Nam, nổi bật với dịch vụ thân thiện và chuyến bay đúng giờ.",
    id: "0962"
  },
  {
    airline_id: 4,
    name: "Vietjet Air",
    image: "https://i.postimg.cc/7638np7k/vietjet-airlines.jpg",
    description: "Vietjet Air là hãng hàng không giá rẻ hàng đầu Việt Nam với mạng lưới bay rộng khắp.",
    id: "37f6"
  }
];

const headCells = [
  { id: 'airline_id', label: 'ID' },
  { id: 'name', label: 'Tên' },
  { id: 'image', label: 'Logo' },
  { id: 'description', label: 'Mô tả' },
  { id: 'id', label: 'Mã' },
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
  const [data, setData] = useState(initialData);
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
    airline_id: '', name: '', image: '', description: '', id: ''
  });

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

  const handleSave = () => {
    const newData = data.map((item) =>
      item.airline_id === editingId ? editedRow : item
    );
    setData(newData);
    setEditingId(null);
  };

  const handleInputChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewAirline({ ...newAirline, [name]: value });
  };

  const handleAddAirline = () => {
    const parsed = { ...newAirline, airline_id: parseInt(newAirline.airline_id) };
    setData([...data, parsed]);
    setOpenModal(false);
    setNewAirline({ airline_id: '', name: '', image: '', description: '', id: '' });
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
                      <Avatar src={row.image} alt={row.name} variant="rounded" />
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
                  <TableCell>{row.id}</TableCell>
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
          {['airline_id', 'Tên hãng hàng không', 'Logo', 'Mô tả'].map((field) => (
            <TextField
              key={field}
              name={field}
              label={field}
              fullWidth
              margin="normal"
              value={newAirline[field]}
              onChange={handleModalChange}
            />
          ))}
          <Button fullWidth variant="contained" onClick={handleAddAirline}>
            Lưu
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}