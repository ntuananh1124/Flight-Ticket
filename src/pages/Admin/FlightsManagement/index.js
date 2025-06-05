import { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
  Typography, MenuItem, Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const initialData = [
    {
        flight_id: 1,
        airplane_id: 1,
        route_id: 1,
        departure_time: "2025-06-01T08:00:00.000Z",
        arrival_time: "2025-06-01T10:10:00.000Z",
        status: "On Time",
        airline_id: 1
    }
];

const headCells = [
    { id: 'flight_id', label: 'ID' },
    { id: 'airplane_id', label: 'Máy bay' },
    { id: 'route_id', label: 'Tuyến bay' },
    { id: 'departure_time', label: 'Giờ đi' },
    { id: 'arrival_time', label: 'Giờ đến' },
    { id: 'status', label: 'Trạng thái' },
    { id: 'airline_id', label: 'Hãng' },
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

export default function FlightsManagement() {
    const [data, setData] = useState(initialData);
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('flight_id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedRow, setEditedRow] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [newFlight, setNewFlight] = useState({
        flight_id: '',
        airplane_id: '',
        route_id: '',
        departure_time: '',
        arrival_time: '',
        status: '',
        airline_id: ''
    });

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelected(data.map((n) => n.flight_id));
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
        const row = data.find((item) => item.flight_id === id);
        setEditedRow({ ...row });
    };

    const handleSave = () => {
        const newData = data.map((item) =>
        item.flight_id === editingId ? editedRow : item
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

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setNewFlight({ ...newFlight, [name]: value });
    };

    const handleAddFlight = () => {
        const parsedFlight = {
        ...newFlight,
        flight_id: parseInt(newFlight.flight_id),
        airplane_id: parseInt(newFlight.airplane_id),
        route_id: parseInt(newFlight.route_id),
        airline_id: parseInt(newFlight.airline_id),
        departure_time: new Date(newFlight.departure_time).toISOString(),
        arrival_time: new Date(newFlight.arrival_time).toISOString()
        };
        setData([...data, parsedFlight]);
        setOpenModal(false);
        setNewFlight({
        flight_id: '',
        airplane_id: '',
        route_id: '',
        departure_time: '',
        arrival_time: '',
        status: '',
        airline_id: ''
        });
    };

    // const isSelected = (id) => selected.indexOf(id) !== -1;

    const sortedData = filteredData.sort(getComparator(order, orderBy));
    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                Thêm chuyến bay
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
                    const isItemSelected = isSelected(row.flight_id);
                    const isEditing = editingId === row.flight_id;
                    return (
                        <TableRow
                        key={row.flight_id}
                        hover
                        selected={isItemSelected}
                        onClick={() => handleClick(row.flight_id)}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                        </TableCell>
                        <TableCell>{row.flight_id}</TableCell>
                        <TableCell>{row.airplane_id}</TableCell>
                        <TableCell>{row.route_id}</TableCell>
                        <TableCell>{row.departure_time}</TableCell>
                        <TableCell>{row.arrival_time}</TableCell>
                        <TableCell>
                            {isEditing ? (
                            <TextField
                                select
                                value={editedRow.status || 'On Time'}
                                onChange={(e) => handleInputChange(e, 'status')}
                                size="small"
                                fullWidth
                            >
                                <MenuItem value="On Time">On Time</MenuItem>
                                <MenuItem value="Delayed">Delayed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </TextField>
                            ) : (
                            row.status
                            )}
                        </TableCell>
                        <TableCell>{row.airline_id}</TableCell>
                        <TableCell>
                            {isEditing ? (
                            <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                            ) : (
                            <IconButton onClick={() => handleEdit(row.flight_id)}><EditIcon /></IconButton>
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
                <Typography variant="h6" mb={2}>Thêm chuyến bay</Typography>
                {['flight_id', 'airplane_id', 'route_id', 'departure_time', 'arrival_time', 'status', 'airline_id'].map((field) => (
                    <TextField
                    key={field}
                    label={field}
                    name={field}
                    fullWidth
                    margin="normal"
                    type={field.includes('time') ? 'datetime-local' : 'text'}
                    value={newFlight[field]}
                    onChange={handleModalChange}
                    InputLabelProps={field.includes('time') ? { shrink: true } : {}}
                    />
                ))}
                <Button fullWidth variant="contained" onClick={handleAddFlight}>Lưu</Button>
                </Box>
            </Modal>
        </Paper>
    );
}
