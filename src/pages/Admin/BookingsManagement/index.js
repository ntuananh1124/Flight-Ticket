import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TextField, IconButton, Button, Box, Modal,
  Typography, MenuItem
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function BookingsManagement() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [seats, setSeats] = useState([]);

  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('booking_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [bookingsRes, usersRes, flightsRes, airlinesRes, routesRes, airportsRes, passengersRes, ticketsRes, seatsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/flights'),
        axios.get('http://localhost:5000/api/airlines'),
        axios.get('http://localhost:5000/api/routes'),
        axios.get('http://localhost:5000/api/airports'),
        axios.get('http://localhost:5000/api/passengers'),
        axios.get('http://localhost:5000/api/tickets'),
        axios.get('http://localhost:5000/api/seats'),
      ]);

      setData(bookingsRes.data);
      setUsers(usersRes.data);
      setFlights(flightsRes.data);
      setAirlines(airlinesRes.data);
      setRoutes(routesRes.data);
      setAirports(airportsRes.data);
      setPassengers(passengersRes.data);
      setTickets(ticketsRes.data);
      setSeats(seatsRes.data);
    };

    fetchData();
  }, []);

  const getUserName = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.name : 'Unknown';
  };

  const getFlightInfo = (flightId) => {
    const flight = flights.find((f) => f.flight_id === flightId);
    if (!flight) return 'Unknown';

    const route = routes.find((r) => r.route_id === flight.route_id);
    const airline = airlines.find((a) => a.airline_id === flight.airline_id);

    const getAirportName = (airportId) => {
      const airport = airports.find((a) => a.airport_id === airportId);
      return airport ? airport.location : 'Unknown';
    };

    const routeName = route
      ? `${getAirportName(route.from_airport)} - ${getAirportName(route.to_airport)}`
      : 'Unknown';

    return `${routeName} | ${airline?.name || 'Unknown'} | ${new Date(flight.departure_time).toLocaleString()}`;
  };

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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.includes(id);

  const filteredData = data
    .filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter((row) =>
      statusFilter === 'All' ? true : row.status === statusFilter
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
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} gap={2}>
        <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField
          select
          label="Lọc trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="All">Tất cả</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Unpaid">Unpaid</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
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
    <TableCell>Ngày đặt</TableCell> {/* CỘT MỚI */}
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
                  <TableCell>{getUserName(row.user_id)}</TableCell>
                  <TableCell>{getFlightInfo(row.flight_id)}</TableCell>
                  <TableCell>
                    {new Date(row.booking_date).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
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
              <Typography>Giá: {detailData.ticket?.price?.toLocaleString()} VND</Typography>
              <Typography>Ghế: {detailData.seat?.seat_number} ({detailData.seat?.class})</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Paper>
  );
}
