import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box,
  Modal, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const initialData = [
  {
    booking_id: 1,
    user_id: 1,
    flight_id: 1,
    status: "Paid",
    id: "5f74"
  }
];

const headCells = [
  { id: 'booking_id', label: 'Booking ID' },
  { id: 'user_id', label: 'User ID' },
  { id: 'flight_id', label: 'Flight ID' },
  { id: 'status', label: 'Status' },
  { id: 'id', label: 'Mã đặt vé' },
  { id: 'actions', label: 'Actions' }
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
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400, bgcolor: 'background.paper',
  borderRadius: 2, boxShadow: 24, p: 4,
};

export default function BookingsManagement() {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('booking_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.booking_id));
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
    const row = data.find((item) => item.booking_id === id);
    setEditedRow({ ...row });
  };

  const handleSave = () => {
    const newData = data.map((item) =>
      item.booking_id === editingId ? editedRow : item
    );
    setData(newData);
    setEditingId(null);
  };

  const handleInputChange = (e, key) => {
    setEditedRow({ ...editedRow, [key]: e.target.value });
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
    <div className="my-container" style={{marginTop: '30px'}}>
        <Paper>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                    const isItemSelected = isSelected(row.booking_id);
                    const isEditing = editingId === row.booking_id;
                    return (
                        <TableRow
                        key={row.booking_id}
                        hover
                        selected={isItemSelected}
                        onClick={() => handleClick(row.booking_id)}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                        </TableCell>
                        {Object.keys(row).map((key) =>
                            key !== 'booking_id' && isEditing ? (
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
                            <IconButton onClick={() => handleEdit(row.booking_id)}><EditIcon /></IconButton>
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
        </Paper>
    </div>
  );
}
