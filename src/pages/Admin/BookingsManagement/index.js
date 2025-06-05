import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const initialBookings = [
  { booking_id: 1, user_id: 1, flight_id: 1, status: "Paid", id: "2246" }
];

const passengers = [
  {
    booking_id: 1,
    full_name: "Nguyễn Thị C",
    email: "ntc@gmail.com",
    phone_number: "0909555666",
    date_of_birth: "1995-03-12",
    nationality: "Việt Nam",
    identity_number: "012345678",
    id: "5185"
  }
];

const tickets = [
  {
    ticket_id: 1,
    booking_id: 1,
    seat_id: 1,
    price: 1500000,
    ticket_type: "Economy",
    id: "3c87"
  }
];

const seats = [
  {
    seat_id: 1,
    airplane_id: 1,
    seat_number: "A1",
    class: "Economy",
    id: "ac54"
  }
];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function BookingsManagement() {
  const [data, setData] = useState(initialBookings);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('booking_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

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

  const handleViewDetail = (bookingId) => {
    const passenger = passengers.find((p) => p.booking_id === bookingId);
    const ticket = tickets.find((t) => t.booking_id === bookingId);
    const seat = seats.find((s) => s.seat_id === ticket?.seat_id);
    setDetailData({ passenger, ticket, seat });
    setDetailModalOpen(true);
  };

  return (
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
              <TableCell>ID</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Chuyến bay</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const isItemSelected = isSelected(row.booking_id);
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
                  <TableCell>{row.booking_id}</TableCell>
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell>{row.flight_id}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetail(row.booking_id)}>
                      <VisibilityIcon />
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

      <Modal open={detailModalOpen} onClose={() => setDetailModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Chi tiết Booking</Typography>
          {detailData && (
            <Box mt={2}>
              <Typography variant="subtitle1">Hành khách</Typography>
              <Typography>Họ tên: {detailData.passenger?.full_name}</Typography>
              <Typography>Email: {detailData.passenger?.email}</Typography>
              <Typography>SĐT: {detailData.passenger?.phone_number}</Typography>
              <Typography>Ngày sinh: {detailData.passenger?.date_of_birth}</Typography>
              <Typography>Quốc tịch: {detailData.passenger?.nationality}</Typography>
              <Typography>CMND/CCCD: {detailData.passenger?.identity_number}</Typography>
              <Typography mt={2} variant="subtitle1">Vé</Typography>
              <Typography>Loại: {detailData.ticket?.ticket_type}</Typography>
              <Typography>Giá: {detailData.ticket?.price.toLocaleString()} VND</Typography>
              <Typography>Ghế: {detailData.seat?.seat_number} ({detailData.seat?.class})</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Paper>
  );
}
