import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, FormControlLabel, Grid, Paper, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { getAirlinesList } from '../../services/airlinesServices';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import "./GetTicket.scss";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function GetTicket() {
    const [airlinesList, setAirlinesList] = useState();
    const [alignment, setAlignment] = useState('web');
    const [num, setNum] = useState(0);

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const handleClick = () => {
        setNum(a => ++a);
        if (num % 2 !== 0) {
            console.log('clicked number', num);
        }
    }

    useEffect(() => {
        const fetchApi = async () => {
            const getList = await getAirlinesList(); 
            if (getList) {
                console.log(getList);
                setAirlinesList(getList);
            };
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
                                <Paper elevation={3}>
                                    <div className="get-ticket__flight-content__inner">
                                        <div className="get-ticket__flight-content__inner__airline">
                                            <div className="get-ticket__flight-content__inner__airline__img">
                                                <img src="" alt="logo-here" />
                                            </div>
                                            <div className="get-ticket__flight-content__inner__airline__name">
                                                <span>Vietjet Air</span>
                                            </div>
                                        </div>
                                        <div className="get-ticket__flight-content__inner__route">
                                            <div className="get-ticket__flight-content__inner__route__from">
                                                <span>23:50</span>
                                                <span>HAN</span>
                                            </div>
                                            <div className="get-ticket__flight-content__inner__route__time">
                                                <span>2h 10m</span>
                                            </div>
                                            <div className="get-ticket__flight-content__inner__route__to">
                                                <span>02:00</span>
                                                <span>SGN</span>
                                            </div>
                                        </div>
                                        <div className="get-ticket__flight-content__inner__prices">
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={alignment}
                                                exclusive
                                                onChange={handleChange}
                                                aria-label="Platform"
                                                >
                                                <ToggleButton value="economy" onClick={handleClick}>
                                                    <div className="class">
                                                        <span>Economy</span>
                                                        <span className="price"><b>150</b>$</span>
                                                    </div>
                                                </ToggleButton>
                                                <ToggleButton value="business" onClick={handleClick}>
                                                    <div className="class">
                                                        <span>Business</span>
                                                        <span className="price"><b>300</b>$</span>
                                                    </div>
                                                </ToggleButton>
                                                <ToggleButton value="first" onClick={handleClick}>
                                                    <div className="class">
                                                        <span>First</span>
                                                        <span className="price"><b>450</b>$</span>
                                                    </div>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </div>
                                    </div>
                                </Paper>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}