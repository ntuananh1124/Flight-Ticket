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

    console.log("GetTicket params:", fromParam, toParam);

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

                const getPrice = (prices, className) => {
                    const priceObj = prices.find(p => p.class.toLowerCase() === className.toLowerCase());
                    return priceObj ? `${priceObj.price}$` : "N/A";
                };

                const result = Flights.map(flight => {
                    const airline = airlinesList.find(a => a.airline_id === flight.airline_id);
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
                    <h2>TÌM CHUYẾN BAY CỦA BẠN</h2>
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
                                    <h3>BỘ LỌC</h3>
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
                                                                    <Avatar src={airline.image} alt={airline.name} sx={{ width: 24, height: 24 }} variant="square" />
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
                                        {flightList.length > 0 ? flightList.map((item, index) =>
                                            <Grid item size={12} key={index}>
                                                <Paper elevation={3}>
                                                    {/* nội dung flight item */}
                                                    {/* giữ nguyên phần render chuyến bay của bạn như cũ */}
                                                </Paper>
                                            </Grid>
                                        ) : (
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
