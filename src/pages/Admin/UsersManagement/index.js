import './UsersManagement.scss';
import { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const initialData = [
  { user_id: 1, name: "Nguy?n Văn A", email: "vana@gmail.com", password: "123456", phone_number: "0909123456", created_at: "2025-05-21T16:19:26.930Z" },
  { user_id: 2, name: "Tr?n Th? B", email: "thib@gmail.com", password: "abcdef", phone_number: "0911222333", created_at: "2025-05-21T16:19:26.930Z" },
  { user_id: 3, name: "Mai Duy Sơn", email: "maiduyson2k4@gmail.com", password: "sonson123", phone_number: "0909123455", created_at: "2025-06-02T15:44:11.500Z" },
  { user_id: 4, name: "Tr?n Nam Khánh", email: "trankhanh2k4@gmail.com", password: "khanhsky123", phone_number: "0909123450", created_at: "2025-06-02T15:44:11.500Z" },
  { user_id: 5, name: "Tô Văn Nam", email: "tonam2k4@gmail.com", password: "tonam2004", phone_number: "0959123450", created_at: "2025-06-02T15:44:11.500Z" },
  { user_id: 6, name: "Nguy?n Do?n Nam", email: "namnam2k4@gmail.com", password: "nam2004", phone_number: "0959143450", created_at: "2025-06-02T15:44:11.500Z" },
  { user_id: 7, name: "Nguy?n Văn Nam", email: "vannam2004@gmail.com", password: "nam2004", phone_number: "0359143750", created_at: "2025-06-02T15:44:11.500Z" },
  { user_id: 8, name: "Dương Hoài Nam", email: "duonghoainam24@gmail.com", password: "abcdef", phone_number: "0911222345", created_at: "2025-06-02T15:44:11.500Z" }
];

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
  width: 400, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function UserTable() {
  const [data, setData] = useState(initialData);
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
    user_id: '', name: '', email: '', password: '', phone_number: '', created_at: ''
  });

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

  const handleSave = () => {
    const newData = data.map((item) =>
      item.user_id === editingId ? editedRow : item
    );
    setData(newData);
    setEditingId(null);
  };

  const handleInputChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = () => {
    const parsed = { ...newUser, user_id: parseInt(newUser.user_id) };
    setData([...data, parsed]);
    setOpenModal(false);
    setNewUser({ user_id: '', name: '', email: '', password: '', phone_number: '', created_at: '' });
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
                    key !== 'user_id' && isEditing ? (
                      <TableCell key={key}>
                        <TextField
                          value={editedRow[key]}
                          onChange={(e) => handleInputChange(e, key)}
                          size="small"
                        />
                      </TableCell>
                    ) : (
                      <TableCell key={key}>{row[key]}</TableCell>
                    )
                  )}
                  <TableCell>
                    {isEditing ? (
                      <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(row.user_id)}><EditIcon /></IconButton>
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
          {['user_id', 'name', 'email', 'password', 'phone_number', 'created_at'].map((field) => (
            <TextField
              key={field}
              name={field}
              label={field}
              fullWidth
              margin="normal"
              value={newUser[field]}
              onChange={handleModalChange}
            />
          ))}
          <Button fullWidth variant="contained" onClick={handleAddUser}>
            Lưu
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
}
