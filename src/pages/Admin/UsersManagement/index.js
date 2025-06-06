import './UsersManagement.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const headCells = [
  { id: 'user_id', label: 'ID' },
  { id: 'name', label: 'Tên' },
  { id: 'email', label: 'Email' },
  { id: 'password', label: 'Mật khẩu' },
  { id: 'phone_number', label: 'Số điện thoại' },
  { id: 'created_at', label: 'Ngày tạo' },
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
  width: '50vw', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function UsersManagement() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('user_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', phone_number: ''
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi khi fetch users:', error);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.user_id));
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

  const handleEdit = (id) => {
    setEditingId(id);
    const row = data.find((item) => item.user_id === id);
    setEditedRow({ ...row });
  };

  const handleSave = async () => {
  const { name, email, password, phone_number } = editedRow;

  if (!name || !email || !password || !phone_number) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ');
    return;
  }

  const emailExists = data.some((user) =>
    user.email === email && user.user_id !== editingId
  );
  if (emailExists) {
    alert('Email này đã được sử dụng');
    return;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone_number)) {
    alert('Số điện thoại không hợp lệ (phải gồm 10 số và bắt đầu bằng số 0)');
    return;
  }

  try {
    await axios.put(`http://localhost:5000/api/users/${editingId}`, editedRow);
    await fetchUsers();
    setEditingId(null);
    alert('Cập nhật thành công!');
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error);
  }
};

  const handleConfirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${confirmDeleteId}`);
      await fetchUsers();
      setConfirmDeleteId(null);
      alert('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xoá user:', error);
    }
  };

  const handleInputChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async () => {
  const { name, email, password, phone_number } = newUser;

  if (!name || !email || !password || !phone_number) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    alert('Email không hợp lệ');
    return;
  }

  const emailExists = data.some((user) => user.email === email);
  if (emailExists) {
    alert('Email này đã được sử dụng');
    return;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone_number)) {
    alert('Số điện thoại không hợp lệ (phải gồm 10 số và bắt đầu bằng số 0)');
    return;
  }

  try {
    const currentDate = new Date().toISOString();
    const payload = {
      ...newUser,
      created_at: currentDate
    };

    await axios.post('http://localhost:5000/api/users', payload);
    await fetchUsers();

    alert('Thêm người dùng thành công!');
    setOpenModal(false);
    setNewUser({ name: '', email: '', password: '', phone_number: '' });
  } catch (error) {
    alert('Lỗi khi thêm người dùng', error);
    console.error('Lỗi khi thêm user:', error);
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
          Thêm người dùng
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
              const isItemSelected = isSelected(row.user_id);
              const isEditing = editingId === row.user_id;
              return (
                <TableRow
                  key={row.user_id}
                  hover
                  selected={isItemSelected}
                  onClick={() => handleClick(row.user_id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  {Object.keys(row).map((key) =>
                    key !== 'user_id' && key !== 'created_at' && isEditing ? (
                      <TableCell key={key}>
                        <TextField
                          value={editedRow[key]}
                          onChange={(e) => handleInputChange(e, key)}
                          size="small"
                        />
                      </TableCell>
                    ) : (
                      <TableCell key={key}>
                        {key === 'created_at'
                          ? new Date(row[key]).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : row[key]}
                      </TableCell>
                    )
                  )}
                  <TableCell>
                    {isEditing ? (
                      <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(row.user_id)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleConfirmDelete(row.user_id)}><DeleteIcon /></IconButton>
                      </>
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
          <Typography variant="h6" mb={2}>Thêm người dùng</Typography>
          <TextField
            label="Tên đăng nhập"
            name="name"
            fullWidth
            margin="normal"
            value={newUser.name}
            onChange={handleModalChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={newUser.email}
            onChange={handleModalChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={newUser.password}
            onChange={handleModalChange}
          />
          <TextField
            label="Số điện thoại"
            name="phone_number"
            fullWidth
            margin="normal"
            value={newUser.phone_number}
            onChange={handleModalChange}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: 'orange' }} onClick={handleAddUser}>
            LƯU
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá người dùng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Huỷ</Button>
          <Button onClick={handleDelete} color="error">Xoá</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
