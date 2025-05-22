import { Avatar, Box, FormControlLabel, Grid, List, ListItem, Radio, RadioGroup } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import { getAirlinesList } from '../../services/airlinesServices';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

export default function GetTicket() {
    const [airlinesList, setAirlinesList] = useState();

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
                    <Grid container>
                        <Grid size={4}>
                            <div className="get-ticket__flight-content__filter">
                                <h3>BỘ LỌC</h3>
                                <div className="get-ticket__flight-content__filter__time">
                                    <h3>Thời gian</h3>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateRangePicker />
                                    </LocalizationProvider>
                                </div>
                                <div className="get-ticket__flight-content__filter__airlines">
                                    <h3>Hãng hàng không</h3>
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
                                </div>
                            </div>
                        </Grid>
                        <Grid size={8}>
                            <div className="get-ticket__flight-content__list">

                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}