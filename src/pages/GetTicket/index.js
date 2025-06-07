import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormControlLabel, Grid, Modal, Paper, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { getAirlinesAxios } from '../../services/airlinesServices';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import "./GetTicket.scss";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getFlightPricesAxios } from "../../services/flightServices";
import { getAirportListAxios } from "../../services/airportServices";
import { getRoutesAxios } from "../../services/routesServies";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';

export default function GetTicket() {
    const [airlinesList, setAirlinesList] = useState([]);
    const [flightList, setFlightList] = useState([]);
    const [selectedClassMap, setSelectedClassMap] = useState({});
    const [selectedDateRange, setSelectedDateRange] = useState([dayjs(), dayjs()]);
    const [selectedAirlines, setSelectedAirlines] = useState("");
    const [openModalFlightId, setOpenModalFlightId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');

    const handleAirlinesChange = (event) => {
        setSelectedAirlines(event.target.value);
    };

    const handleClassChange = (flightIndex, newClass) => {
        setSelectedClassMap(prev => ({
            ...prev,
            [flightIndex]: prev[flightIndex] === newClass ? null : newClass
        }));
    };

    const handleOpenModal = (flightIndex) => {
        setOpenModalFlightId(flightIndex);
    };

    const handleCloseModal = () => {
        setOpenModalFlightId(null);
    };

    const getFormattedClass = (cls) => cls.charAt(0).toUpperCase() + cls.slice(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                if (fromParam) params.set("from", fromParam);
                if (toParam) params.set("to", toParam);

                if (selectedDateRange[0]) {
                    params.set("start", selectedDateRange[0].format("YYYY-MM-DD"));
                }

                if (selectedAirlines) {
                    params.set("airline_id", selectedAirlines);
                }

                const response = await axios.get(`http://localhost:5000/api/flights?${params.toString()}`);
                const Flights = response.data;

                const Airports = await getAirportListAxios();
                const Routes = await getRoutesAxios();
                const FlightPrices = await getFlightPricesAxios();

                const result = Flights.map(flight => {
                    const route = Routes.find(r => r.route_id === flight.route_id);

                    const fromAirport = Airports.find(a => a.airport_id === route?.from_airport);
                    const toAirport = Airports.find(a => a.airport_id === route?.to_airport);

                    const prices = FlightPrices.filter(p => p.flight_id === flight.flight_id);

                    const depDate = dayjs(flight.departure_time);
                    const arrDate = dayjs(flight.arrival_time);
                    const minutes = arrDate.diff(depDate, 'minute');
                    const hours = Math.floor(minutes / 60);
                    const mins = minutes % 60;
                    const durationStr = `${hours}h ${mins}m`;

                    const airline = airlinesList.find(a => a.airline_id === flight.airline_id);

                    const getPrice = (prices, className) => {
                        const priceObj = prices.find(p => p.class.toLowerCase() === className.toLowerCase());
                        return priceObj ? `${priceObj.price}$` : "100$";
                    };

                    return {
                        airlineName: airline?.name || "Unknown",
                        airlineLogo: airline?.image || "",
                        departure: {
                            time: depDate.format('HH:mm'),
                            date: depDate.format('D/M/YYYY'),
                            location: fromAirport?.location || "N/A",
                            code: fromAirport?.code || "N/A"
                        },
                        arrival: {
                            time: arrDate.format('HH:mm'),
                            date: arrDate.format('D/M/YYYY'),
                            location: toAirport?.location || "N/A",
                            code: toAirport?.code || "N/A"
                        },
                        duration: durationStr,
                        prices: {
                            Economy: getPrice(prices, "Economy"),
                            Business: getPrice(prices, "Business"),
                            First: getPrice(prices, "First")
                        }
                    };
                });

                setFlightList(result);
            } catch (err) {
                console.error("Lỗi khi fetch Flights:", err);
                setFlightList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fromParam, toParam, selectedDateRange, selectedAirlines, airlinesList]);

    useEffect(() => {
        const fetchAirlines = async () => {
            const Airlines = await getAirlinesAxios();
            setAirlinesList(Airlines);
        };
        fetchAirlines();
    }, []);

    return (
        <div className="get-ticket">
            <div className="my-container">
                <div className="get-ticket__search">
                    <h2>TÌm chuyến bay của bạn</h2>
                    <Grid container>
                        <Grid item size={12}>
                            <Search />
                        </Grid>
                    </Grid>
                </div>
                <div className="get-ticket__flight-content">
                    <Grid container spacing={2}>
                        <Grid item size={4}>
                            <Paper elevation={3}>
                                <div className="get-ticket__flight-content__filter">
                                    <h3>Bộ lọc</h3>
                                    <div className="get-ticket__flight-content__filter__time">
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography component='h3'>Thời gian</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DateRangePicker
                                                        value={selectedDateRange}
                                                        onChange={(newValue) => setSelectedDateRange(newValue)}
                                                    />
                                                </LocalizationProvider>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                    <div className="get-ticket__flight-content__filter__airlines">
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography component='h3'>Hãng hàng không</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <RadioGroup name="airlines" value={selectedAirlines} onChange={handleAirlinesChange}>
                                                    {airlinesList && airlinesList.map((airline) =>
                                                        <FormControlLabel
                                                            key={airline.airline_id}
                                                            value={airline.airline_id.toString()}
                                                            control={<Radio />}
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                    <Avatar src={airline.image} alt={airline.name} sx={{ width: 24, height: 24 }} />
                                                                    {airline.name}
                                                                </Box>
                                                            }>
                                                        </FormControlLabel>
                                                    )}
                                                </RadioGroup>
                                            </AccordionDetails>
                                        </Accordion>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item size={8}>
                            <div className="get-ticket__flight-content__list">
                                {loading ? (
                                    <Typography variant="body1" sx={{ p: 2 }}>Đang tải chuyến bay...</Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {flightList.length > 0 ? flightList.map((item, index) => (
                                            <Grid item size={12} key={index} style={{position: 'relative'}}>
                                                <Paper elevation={3} sx={{ p: 2 }}>
                                                    <div className="get-ticket__flight-content__inner">
                                                        <div className="get-ticket__flight-content__inner__airline">
                                                            <div className="get-ticket__flight-content__inner__airline__img">
                                                                <img style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} src={item.airlineLogo} alt="logo-here" />
                                                            </div>
                                                            <div className="get-ticket__flight-content__inner__airline__name">
                                                                <span>{item.airlineName}</span>
                                                            </div>
                                                        </div>

                                                        <div className="get-ticket__flight-content__inner__route">
                                                            <div className="get-ticket__flight-content__inner__route__from">
                                                                <span>{item.departure.time}</span>
                                                                <span style={{ color: 'green', fontSize: '13px' }}><b>{item.departure.date}</b></span>
                                                                <span>{item.departure.location}</span>
                                                            </div>
                                                            <div className="get-ticket__flight-content__inner__route__time">
                                                                <span>{item.duration}</span>
                                                            </div>
                                                            <div className="get-ticket__flight-content__inner__route__to">
                                                                <span>{item.arrival.time}</span>
                                                                <span style={{ color: 'green', fontSize: '13px' }}><b>{item.arrival.date}</b></span>
                                                                <span>{item.arrival.location}</span>
                                                            </div>
                                                        </div>

                                                        <div className="get-ticket__flight-content__inner__prices">
                                                            <ToggleButtonGroup
                                                                color="primary"
                                                                value={selectedClassMap[index] || null}
                                                                exclusive
                                                                onChange={(e, newClass) => handleClassChange(index, newClass)}
                                                                aria-label="class selector"
                                                            >
                                                                {Object.entries(item.prices).map(([className, price]) => (
                                                                    <ToggleButton
                                                                        key={className}
                                                                        value={className.toLowerCase()}
                                                                    >
                                                                        <div style={{ textAlign: "center" }}>
                                                                            <span>{className}</span>
                                                                            <span className="price">{price}</span>
                                                                        </div>
                                                                    </ToggleButton>
                                                                ))}
                                                            </ToggleButtonGroup>
                                                        </div>

                                                        <Box textAlign="center" mt={2} style={{position: 'absolute',bottom: '0',right:'16px' }}>
                                                            <Button variant="contained" style={{ marginBottom: '5px', color: 'white' }} disabled={!selectedClassMap[index]} onClick={() => handleOpenModal(index)}>
                                                                Chi tiết
                                                            </Button>
                                                        </Box>

                                                        <Modal open={openModalFlightId === index} onClose={handleCloseModal}>
                                                            <Box
                                                                sx={{
                                                                    p: 4,
                                                                    width: '30vw',
                                                                    bgcolor: "background.paper",
                                                                    borderRadius: 2,
                                                                    mx: "auto",
                                                                    mt: "15%",
                                                                    boxShadow: 24
                                                                }}
                                                            >
                                                                <Typography variant="h6" gutterBottom>Thông tin chuyến bay</Typography>
                                                                <Typography>Hãng: {item.airlineName}</Typography>
                                                                <Typography>
                                                                    {item.departure.code} ({item.departure.time} - {item.departure.date}) → {item.arrival.code} ({item.arrival.time} - {item.arrival.date})
                                                                </Typography>
                                                                {selectedClassMap[index] && (
                                                                    <>
                                                                        <Typography>Hạng ghế: {getFormattedClass(selectedClassMap[index])}</Typography>
                                                                        <Typography>Giá: {item.prices[getFormattedClass(selectedClassMap[index])]}</Typography>
                                                                    </>
                                                                )}
                                                                <Box mt={3} textAlign="right">
                                                                    <Button variant="contained" color="primary" style={{ color: 'white' }} onClick={handleCloseModal}>
                                                                        Đóng
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Modal>
                                                    </div>
                                                </Paper>
                                            </Grid>
                                        )) : (
                                            <Typography variant="body1" sx={{ p: 2 }}>Không có chuyến bay phù hợp.</Typography>
                                        )}
                                    </Grid>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
}