import { useEffect, useMemo, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
    TableRow, Checkbox, TableSortLabel, TextField, IconButton, Button, Box, Modal,
    Typography, MenuItem, Autocomplete, Grid,
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightIcon from '@mui/icons-material/Flight';
import { getAirportByIdAxios, getAirportListAxios } from '../../../services/airportServices';
import SaveIcon from '@mui/icons-material/Save';
import { getAirlinesAxios } from '../../../services/airlinesServices';
// import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAirplanesAxios } from '../../../services/airplanes';
import axios from 'axios';
import { getRoutesAxios } from '../../../services/routesServies';
import dayjs from 'dayjs';
import { getFlightsAxios } from '../../../services/flightServices';

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

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '50vw', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
};

export default function AirplaneTable() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('flight_id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openRouteModal, setOpenRouteModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editedRow, setEditedRow] = useState({});
    const [airlinesList, setAirlinesList] = useState();
    const [departureTime, setDepartureTime] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const [airportList, setAirportList] = useState([]);
    const [distanceKm, setDistanceKm] = useState('');
    const [selectedAirplane, setSelectedAirplane] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedAirline, setSelectedAirline] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [arrivalDate, setArrivalDate] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        airplane: null,
        route: null,
        departureDate: null,
        departureTime: '',
        arrivalDate: null,
        arrivalTime: '',
        status: '',
        airline: null
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
        const row = data.find((item) => item.flight_id === id);

        // Split departure_time & arrival_time
        const depTime = dayjs(row.departure_time);
        const arrTime = dayjs(row.arrival_time);

        setEditingId(id);
        setEditFormData({
            airplane: airplanesList.find((a) => a.airplane_id === row.airplane_id) || null,
            route: routeList.find((r) => r.route_id === row.route_id) || null,
            departureDate: depTime,
            departureTime: depTime.format('HH:mm'),
            arrivalDate: arrTime,
            arrivalTime: arrTime.format('HH:mm'),
            status: row.status,
            airline: airlinesList.find((a) => a.airline_id === row.airline_id) || null
        });
        setOpenEditModal(true);
    };

    const handleSave = async () => {
        try {
            const departureDateTime = dayjs(editFormData.departureDate)
                .hour(Number(editFormData.departureTime.split(':')[0]))
                .minute(Number(editFormData.departureTime.split(':')[1]))
                .second(0)
                .millisecond(0)
                .toISOString();

            const arrivalDateTime = dayjs(editFormData.arrivalDate)
                .hour(Number(editFormData.arrivalTime.split(':')[0]))
                .minute(Number(editFormData.arrivalTime.split(':')[1]))
                .second(0)
                .millisecond(0)
                .toISOString();

            await axios.put(`http://localhost:5000/api/flights/${editingId}`, {
                airplane_id: editFormData.airplane?.airplane_id,
                route_id: editFormData.route?.route_id,
                departure_time: departureDateTime,
                arrival_time: arrivalDateTime,
                status: editFormData.status,
                airline_id: editFormData.airline?.airline_id
            });

            alert('Cập nhật chuyến bay thành công');

            // Reload flights list
            const flightsAxios = await getFlightsAxios();
            const enrichedFlights = enrichFlights(flightsAxios, airplanesList, airlinesList, routeList, airportList);
            setData(enrichedFlights);

            setEditingId(null);
            setOpenEditModal(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật chuyến bay:', error);
            alert(error.response?.data || 'Có lỗi xảy ra khi cập nhật');
        }
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

    const sortedData = filteredData.sort(getComparator(order, orderBy));

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleCreateRoute = async () => {
    if (!departure?.airport_id || !destination?.airport_id || !distanceKm) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const existingRoute = routeList.find((route) => 
        Number(route.from_airport) === Number(departure.airport_id) &&
        Number(route.to_airport) === Number(destination.airport_id)
    );

    if (existingRoute) {
        alert('Tuyến bay này đã có sẵn!');
        return;
    }

    try {
        await axios.post('http://localhost:5000/api/routes', {
            from_airport: departure.airport_id,
            to_airport: destination.airport_id,
            distance_km: parseFloat(distanceKm)
        });

        alert('Tạo tuyến bay thành công');
        setOpenRouteModal(false);
        setDeparture(null);
        setDestination(null);
        setDistanceKm('');
    } catch (err) {
        console.error('Lỗi khi tạo tuyến bay:', err);
        alert(err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại');
    }
    };

    const handleAddFlight = async () => {
        if (!selectedAirplane || !selectedRoute || !selectedAirline || !departureDate || !arrivalDate || !departureTime || !arrivalTime) {
            alert("Vui lòng điền đầy đủ thông tin chuyến bay.");
            return;
        }

        try {
            const departureDateTime = dayjs(departureDate).hour(Number(departureTime.split(':')[0])).minute(Number(departureTime.split(':')[1])).second(0).millisecond(0).toISOString();
            const arrivalDateTime = dayjs(arrivalDate).hour(Number(arrivalTime.split(':')[0])).minute(Number(arrivalTime.split(':')[1])).second(0).millisecond(0).toISOString();

            // eslint-disable-next-line
            const res = await axios.post('http://localhost:5000/api/flights', {
                airplane_id: selectedAirplane.airplane_id,
                route_id: selectedRoute.route_id,
                departure_time: departureDateTime,
                arrival_time: arrivalDateTime,
                status: 'On Time',
                airline_id: selectedAirline.airline_id
            });

            alert('Thêm chuyến bay thành công');
            setOpenModal(false);
            // Reload flights list
            const flightsAxios = await getFlightsAxios();
            const enrichedFlights = enrichFlights(flightsAxios, airplanesList, airlinesList, routeList, airportList);
            setData(enrichedFlights);

            // Reset form:
            setSelectedAirplane(null);
            setSelectedRoute(null);
            setSelectedAirline(null);
            setDepartureDate(null);
            setArrivalDate(null);
            setDepartureTime('');
            setArrivalTime('');
        } catch (error) {
            console.error('Lỗi khi thêm chuyến bay:', error);
            alert(error.response?.data || 'Có lỗi xảy ra');
        }
    };

    const [airplanesList, setAirplanesList] = useState([]);
    const [routeList, setRouteList] = useState([]);

    const enrichFlights = (flights, airplanes, airlines, routes, airports) => {
        const getAirportName = (airportId) => {
            const airport = airports.find((a) => a.airport_id === airportId);
            return airport ? airport.location : 'Unknown';
        };

        return flights.map((flight) => {
            const airplane = airplanes.find((a) => a.airplane_id === flight.airplane_id);
            const airline = airlines.find((a) => a.airline_id === flight.airline_id);
            const route = routes.find((r) => r.route_id === flight.route_id);

            return {
                ...flight,
                airplane_name: airplane?.model || 'Unknown',
                airline_name: airline?.name || 'Unknown',
                route_name: route ? `${getAirportName(route.from_airport)} - ${getAirportName(route.to_airport)}` : 'Unknown',
            };
        });
    };


    useEffect(() => {
        const fetchApi = async () => {
            const airlinesAxios = await getAirlinesAxios();
            if (airlinesAxios) {
                setAirlinesList(airlinesAxios);
            }

            const airplanesAxios = await getAirplanesAxios();
            if (airplanesAxios) setAirplanesList(airplanesAxios);

            const routesAxios = await getRoutesAxios();

            const flightsAxios = await getFlightsAxios();
            const airportAxios = await getAirportListAxios();
            if (airportAxios) setAirportList(airportAxios);

            if (routesAxios) {
                const airportIds = Array.from(new Set(
                    routesAxios.flatMap(route => [route.from_airport, route.to_airport])
                    ));

                const airportMap = {};

                for (const id of airportIds) {
                    const data = await getAirportByIdAxios(id);
                    if (data) {
                        airportMap[id] = {
                        name: data.name,
                        location: data.location
                        };
                    }
                }

                const routesWithNames = routesAxios.map(route => ({
                    ...route,
                    from_airport_name: airportMap[route.from_airport]?.name,
                    from_airport_location: airportMap[route.from_airport]?.location,
                    to_airport_name: airportMap[route.to_airport]?.name,
                    to_airport_location: airportMap[route.to_airport]?.location
                }));
                setRouteList(routesWithNames);

                try {
                    // debugger
                    // const enrichedFlights = flightsAxios.map((flight) => {
                    //     const airplane = airplanesAxios.find((a) => a.airplane_id === flight.airplane_id);
                    //     const airline = airlinesAxios.find((a) => a.airline_id === flight.airline_id);
                    //     // debugger
                    //     const route = routesAxios.find((r) => r.route_id === flight.route_id);
                    //     const getAirportName = (airportId) => {
                    //         const airport = airportAxios.find((a) => a.airport_id === airportId);
                    //         return airport ? airport.location : 'Unknown';
                    //     }

                    //     return {
                    //         ...flight,
                    //         airplane_name: airplane?.model || 'Unknown',
                    //         airline_name: airline?.name || 'Unknown',
                    //         route_name: route ? `${getAirportName(route.from_airport)} - ${getAirportName(route.to_airport)}` : 'Unknown',
                    //     };
                    // });

                    const enrichedFlights = enrichFlights(flightsAxios, airplanesAxios, airlinesAxios, routesAxios, airportAxios);
                    setData(enrichedFlights);

                } catch (error) {
                    console.error('Failed to fetch flight data:', error);
                }
            };

        };

        fetchApi();
    }, [openRouteModal]); //openRouteModal

    const filteredDepartureOptions = useMemo(() => {
        if (!destination) return airportList;
        return airportList.filter(
            (airport) => Number(airport.airport_id) !== Number(destination.airport_id)
        );
        }, [airportList, destination]);

        const filteredDestinationOptions = useMemo(() => {
        if (!departure) return airportList;
        return airportList.filter(
            (airport) => Number(airport.airport_id) !== Number(departure.airport_id)
        );
    }, [airportList, departure]);
    // console.log('textfield 2',filteredDestinationOptions);
    // eslint-disable-next-line
    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteFlight = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá chuyến bay này?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/flights/${id}`);
            alert('Xoá chuyến bay thành công');

            // Reload flights list
            const flightsAxios = await getFlightsAxios();
            const enrichedFlights = enrichFlights(flightsAxios, airplanesList, airlinesList, routeList, airportList);
            setData(enrichedFlights);
        } catch (error) {
            console.error('Lỗi khi xoá chuyến bay:', error);
            alert(error.response?.data || 'Có lỗi xảy ra khi xoá');
        }
    };

    return (
        <Paper>
            {!data ? <CircularProgress /> :
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2} gap={2}>
                <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Box display="flex" gap={2}>
                <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenModal(true)}>
                    Thêm chuyến bay
                </Button>
                <Button startIcon={<FlightIcon />} variant="outlined" onClick={() => setOpenRouteModal(true)}>
                    Tạo tuyến bay
                </Button>
                </Box>
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
                        {paginatedData ? paginatedData.map((row) => {
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
                                <TableCell>{row.airplane_name}</TableCell>
                                <TableCell>{row.route_name}</TableCell>
                                <TableCell>{dayjs(row.departure_time).format('HH:mm DD/MM/YYYY')}</TableCell>
                                <TableCell>{dayjs(row.arrival_time).format('HH:mm DD/MM/YYYY')}</TableCell>
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
                                <TableCell>{row.airline_name}</TableCell>
                                <TableCell>
                                    {isEditing ? (
                                        <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => handleEdit(row.flight_id)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDeleteFlight(row.flight_id)} sx={{ ml: 1 }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                        }) : <CircularProgress />}
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

            {/* Modal thêm chuyen bay */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>Thêm chuyến bay</Typography>
                    <Grid container spacing={2}>
                        <Grid item size={12}>
                            <Autocomplete
                                disablePortal
                                options={airplanesList}
                                getOptionLabel={(option) => `${option.model} - ${option.capacity} chỗ`}
                                value={selectedAirplane}
                                onChange={(e, newValue) => setSelectedAirplane(newValue)}
                                renderInput={(params) => <TextField {...params} label="Chọn loại máy bay" />}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <Autocomplete
                                disablePortal
                                options={routeList}
                                getOptionLabel={(option) => `${option.from_airport_location} - ${option.to_airport_location}`}
                                sx={{ width: '100%' }}
                                onChange={(e, newValue) => setSelectedRoute(newValue)}
                                renderInput={(params) => <TextField {...params} label="Tuyến bay" />}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Ngày khởi hành"
                                    value={departureDate}
                                    onChange={(newValue) => setDepartureDate(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Chọn giờ"
                                type="time"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 1800 }} // 30 phút
                                sx={{ width: '100%' }}
                                />
                        </Grid>
                        <Grid item size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Ngày đến" value={arrivalDate} onChange={(newValue) => setArrivalDate(newValue)} />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Chọn giờ"
                                type="time"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 1800 }} // 30 phút
                                sx={{ width: '100%' }}
                                />
                        </Grid>
                        <Grid item size={12}>
                            {airlinesList && <Autocomplete
                                disablePortal
                                options={airlinesList}
                                getOptionLabel={(option) => `${option.name}`}
                                onChange={(e, newValue) => setSelectedAirline(newValue)}
                                sx={{ width: '100%' }}
                                renderInput={(params) => <TextField {...params} label="Hãng hàng không" />}
                            />}
                        </Grid>
                    </Grid>
                    <Button style={{marginTop: '20px'}} fullWidth variant="contained" onClick={handleAddFlight}>Lưu</Button>
                </Box>
            </Modal>

            {/*Modal edit flight*/}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>Sửa chuyến bay</Typography>
                    <Grid container spacing={2}>
                        <Grid item size={12}>
                            <Autocomplete
                                disablePortal
                                options={airplanesList}
                                getOptionLabel={(option) => `${option.model} - ${option.capacity} chỗ`}
                                value={editFormData.airplane}
                                onChange={(e, newValue) => setEditFormData(prev => ({ ...prev, airplane: newValue }))}
                                renderInput={(params) => <TextField {...params} label="Chọn loại máy bay" />}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <Autocomplete
                                disablePortal
                                options={routeList}
                                getOptionLabel={(option) => `${option.from_airport_location} - ${option.to_airport_location}`}
                                value={editFormData.route}
                                onChange={(e, newValue) => setEditFormData(prev => ({ ...prev, route: newValue }))}
                                renderInput={(params) => <TextField {...params} label="Tuyến bay" />}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Ngày khởi hành"
                                    value={editFormData.departureDate}
                                    onChange={(newValue) => setEditFormData(prev => ({ ...prev, departureDate: newValue }))}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Chọn giờ"
                                type="time"
                                value={editFormData.departureTime}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, departureTime: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 1800 }}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Ngày đến"
                                    value={editFormData.arrivalDate}
                                    onChange={(newValue) => setEditFormData(prev => ({ ...prev, arrivalDate: newValue }))}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item size={6}>
                            <TextField
                                label="Chọn giờ"
                                type="time"
                                value={editFormData.arrivalTime}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ step: 1800 }}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <Autocomplete
                                disablePortal
                                options={airlinesList}
                                getOptionLabel={(option) => `${option.name}`}
                                value={editFormData.airline}
                                onChange={(e, newValue) => setEditFormData(prev => ({ ...prev, airline: newValue }))}
                                renderInput={(params) => <TextField {...params} label="Hãng hàng không" />}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <TextField
                                select
                                fullWidth
                                label="Trạng thái"
                                value={editFormData.status}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <MenuItem value="On Time">On Time</MenuItem>
                                <MenuItem value="Delayed">Delayed</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button sx={{ mt: 2 }} fullWidth variant="contained" onClick={handleSave}>Lưu thay đổi</Button>
                </Box>
            </Modal>

            {/* Modal tạo tuyến bay */}
            <Modal open={openRouteModal} onClose={() => setOpenRouteModal(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>Tạo tuyến bay mới</Typography>
                    <Grid container spacing={2}>
                        <Grid item size={6}>
                            <Autocomplete
                                disablePortal
                                aria-required
                                options={filteredDepartureOptions}
                                value={departure}
                                getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                                sx={{ width: '100%' }}
                                onChange={(e, newValue) => {
                                    // console.log('newValue', newValue);
                                    setDeparture(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Điểm khởi hành" />}
                            />
                        </Grid>
                        <Grid item size={6}>
                            <Autocomplete
                                disablePortal
                                aria-required
                                options={filteredDestinationOptions}
                                value={destination}
                                getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                                sx={{ width: '100%' }}
                                onChange={(e, newValue) => setDestination(newValue)}
                                renderInput={(params) => <TextField {...params} label="Điểm đến" />}
                            />
                        </Grid>
                        <Grid item size={12}>
                            <TextField fullWidth name='distanceKm' onChange={(e) => setDistanceKm(e.target.value)} required type='number' label='Quãng đường (km)' />
                        </Grid>
                    </Grid>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" onClick={handleCreateRoute}>Tạo</Button>
                </Box>
                </Box>
            </Modal>
                </>
            }
        </Paper>
    );
}