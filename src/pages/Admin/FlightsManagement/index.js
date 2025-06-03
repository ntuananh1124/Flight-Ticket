import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TableSortLabel, TablePagination, TextField,
  IconButton, Box, Button, Modal, Typography
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
    { id: 'flight_id', label: 'Flight ID' },
    { id: 'airplane_id', label: 'Airplane ID' },
    { id: 'route_id', label: 'Route ID' },
    { id: 'departure_time', label: 'Departure Time' },
    { id: 'arrival_time', label: 'Arrival Time' },
    { id: 'status', label: 'Status' },
    { id: 'airline_id', label: 'Airline ID' },
    { id: 'edit', label: 'Actions' }
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

export default function EnhancedFlightTable() {
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
        const newSelected = filteredData.map((n) => n.flight_id);
        setSelected(newSelected);
        } else {
        setSelected([]);
        }
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) newSelected = [...selected, id];
        else if (selectedIndex === 0) newSelected = selected.slice(1);
        else if (selectedIndex === selected.length - 1) newSelected = selected.slice(0, -1);
        else newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];

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
        setEditedRow(data.find((row) => row.flight_id === id));
    };

    const handleSave = () => {
        const newData = data.map((row) =>
        row.flight_id === editingId ? editedRow : row
        );
        setData(newData);
        setEditingId(null);
    };

    const handleInputChange = (e, key) => {
        setEditedRow({ ...editedRow, [key]: e.target.value });
    };

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

    const isSelected = (id) => selected.indexOf(id) !== -1;

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
                    <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
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
                            checked={filteredData.length > 0 && selected.length === filteredData.length}
                            onChange={handleSelectAllClick}
                            />
                        </TableCell>
                        {headCells.map((headCell) => (
                            <TableCell
                            key={headCell.id}
                            sortDirection={orderBy === headCell.id ? order : false}
                            >
                            {headCell.id !== 'edit' ? (
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
                            onClick={(event) => handleClick(event, row.flight_id)}
                            selected={isItemSelected}
                            >
                            <TableCell padding="checkbox">
                                <Checkbox checked={isItemSelected} />
                            </TableCell>
                            {Object.keys(row).map((key) => (
                                <TableCell key={key}>
                                {isEditing && key !== 'flight_id' ? (
                                    <TextField
                                    value={editedRow[key]}
                                    onChange={(e) => handleInputChange(e, key)}
                                    size="small"
                                    />
                                ) : (
                                    key.includes("time")
                                    ? new Date(row[key]).toLocaleString()
                                    : row[key]
                                )}
                                </TableCell>
                            ))}
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
        </div>
    );
}
