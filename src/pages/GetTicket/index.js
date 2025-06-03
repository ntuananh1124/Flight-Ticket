import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, CircularProgress, FormControlLabel, Grid, Modal, Paper, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { getAirlinesList } from '../../services/airlinesServices';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import "./GetTicket.scss";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getFlightPrices, getFlights } from "../../services/flightServices";
import { getAirportList } from "../../services/airportServices";
import { getRoutes } from "../../services/routesServies";

export default function GetTicket() {
    const [airlinesList, setAirlinesList] = useState();
    const [flightList, setFlightList] = useState();
    const [selectedClass, setSelectedClass] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleChange = (event, newClass) => {
  // Nếu click lại chính cái đang chọn thì bỏ chọn (null)
        if (selectedClass === newClass) {
            setSelectedClass(null);
        } else {
            setSelectedClass(newClass);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const getFormattedClass = (cls) => cls.charAt(0).toUpperCase() + cls.slice(1);

    useEffect(() => {
        const fetchApi = async () => {
            const Airlines = await getAirlinesList(); 
            const Flights = await getFlights();
            const Airports = await getAirportList();
            const Routes = await getRoutes();
            const FlightPrices = await getFlightPrices();
            if (Airlines) {
                // console.log(Airlines);
                setAirlinesList(Airlines);
            };
            if (Flights) {
                // console.log(Flights);
                setFlightList(Flights);
            }


            if (Airlines && Flights && Airports && Routes && FlightPrices) {
                function formatTime(datetime) {
                    return new Date(datetime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                }

                function getDuration(dep, arr) {
                    const minutes = (new Date(arr) - new Date(dep)) / 60000;
                    const hours = Math.floor(minutes / 60);
                    const mins = minutes % 60;
                return `${hours}h ${mins}m`;
                }
                    const result = Flights.map(flight => {
                    const airline = Airlines.find(a => a.airline_id === flight.airline_id);
                    const route = Routes.find(r => r.route_id === flight.route_id);
                    const fromAirport = Airports.find(a => a.airport_id === route.from_airport);
                    const toAirport = Airports.find(a => a.airport_id === route.to_airport);
                    const prices = FlightPrices.filter(p => p.flight_id === flight.flight_id);
                return {
                    airlineName: airline?.name || "Unknown",
                    airlineLogo: airline?.image || "",
                    departure: {
                        time: formatTime(flight.departure_time),
                        date: new Date(flight.departure_time).toLocaleDateString("vi-VN"),
                        code: fromAirport?.code || "N/A"
                    },
                    arrival: {
                        time: formatTime(flight.arrival_time),
                        date: new Date(flight.arrival_time).toLocaleDateString("vi-VN"),
                        code: toAirport?.code || "N/A"
                    },
                    duration: getDuration(flight.departure_time, flight.arrival_time),
                    prices: {
                    Economy: (prices.find(p => p.class === "Economy")?.price || "N/A") + "$",
                    Business: (prices.find(p => p.class === "Business")?.price || "N/A") + "$",
                    First: (prices.find(p => p.class === "First")?.price || "N/A") + "$"
                    }
                };
                });
                // console.log(result);
                setFlightList(result);
            }
        };
        fetchApi();
    }, []);

    return (
        <div className="get-ticket">
            <div className="my-container">
                <div className="get-ticket__search">
                    <h2>TÌM CHUYẾN BAY CỦA BẠN</h2>
                    <Grid container>
                        <Grid size={12}>
                            <Search />
                        </Grid>
                    </Grid>
                </div>
                <div className="get-ticket__flight-content">
                    <Grid container spacing={2}>
                        <Grid size={4}>
                            <Paper elevation={3}>
                                <div className="get-ticket__flight-content__filter">
                                    <h3>BỘ LỌC</h3>
                                    <div className="get-ticket__flight-content__filter__time">
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography component='h3'>Thời gian</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                    <DateRangePicker style={{width: '100%'}} />
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
                                                <RadioGroup name="airlines" defaultValue="Vietnam Airlines">
                                                    {airlinesList && airlinesList.map((airline) => 
                                                        <FormControlLabel
                                                            key={airline.value}
                                                            value={airline.value}
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
                        <Grid size={8}>
                            <div className="get-ticket__flight-content__list">
                                {flightList ? flightList.map((item, index) => 
                                    <Paper elevation={3} key={index + 1}>
                                        <div className="get-ticket__flight-content__inner">
                                            <div className="get-ticket__flight-content__inner__airline">
                                                <div className="get-ticket__flight-content__inner__airline__img">
                                                    <img src={item.airlineLogo} alt="logo-here" />
                                                </div>
                                                <div className="get-ticket__flight-content__inner__airline__name">
                                                    <span>{item.airlineName}</span>
                                                </div>
                                            </div>
                                            <div className="get-ticket__flight-content__inner__route">
                                                <div className="get-ticket__flight-content__inner__route__from">
                                                    <span>{item.departure.time}</span>
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>{item.departure.date}</b></span>
                                                    <span>{item.departure.code}</span>
                                                </div>
                                                <div className="get-ticket__flight-content__inner__route__time">
                                                    <span>{item.duration}</span>
                                                </div>
                                                <div className="get-ticket__flight-content__inner__route__to">
                                                    <span>{item.arrival.time}</span>
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>{item.arrival.date}</b></span>
                                                    <span>{item.arrival.code}</span>
                                                </div>
                                            </div>
                                            <div className="get-ticket__flight-content__inner__prices">
                                                <ToggleButtonGroup
                                                    color="primary"
                                                    value={selectedClass}
                                                    exclusive
                                                    onChange={handleChange}
                                                    aria-label="class selector"
                                                >
                                                    {Object.entries(item.prices).map(([className, price]) => (
                                                        <ToggleButton
                                                            key={className}
                                                            value={className.toLowerCase()}
                                                        >
                                                            <div className="class" style={{ textAlign: "center" }}>
                                                                <span>{className}</span>
                                                                <span className="price">{price}</span>
                                                            </div>
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                            </div>
                                        </div>
                                        {selectedClass && (
                                            <Box textAlign="center" mt={2}>
                                                <Button variant="contained" style={{marginBottom: '15px', color: 'white'}} color="primary" onClick={handleOpenModal}>
                                                Chi tiết
                                                </Button>
                                            </Box>
                                        )}
                                        <Modal open={openModal} onClose={handleCloseModal}>
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
                                            {selectedClass && (
                                                <>
                                                    <Typography>Hạng ghế: {getFormattedClass(selectedClass)}</Typography>
                                                    <Typography>Giá: {item.prices[getFormattedClass(selectedClass)]}</Typography>
                                                </>
                                            )}

                                            <Box mt={3} textAlign="right">
                                                <Button variant="contained" color="primary" style={{color: 'white'}}>
                                                Thêm vào giỏ hàng
                                                </Button>
                                            </Box>
                                            </Box>
                                        </Modal>
                                    </Paper>
                                ) : <CircularProgress />}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}