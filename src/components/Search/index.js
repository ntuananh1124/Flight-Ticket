import { Autocomplete, Button, TextField } from '@mui/material';
import './Search.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { FormGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAirportList } from '../../services/airportServices';

export default function Search() {
    const [airportList, setAirportList] = useState();
    const handleSubmit = () => {
        console.log('submitted');
    };

    useEffect(() => {
        const fetchApi = async () => {
            const resultAirport = await getAirportList();
            if (resultAirport) {
                console.log(resultAirport);
                setAirportList(resultAirport);
            }
        };

        fetchApi();
    }, [])

    return (
        <>
            {airportList && <div className="search">
            <FormGroup onSubmit={handleSubmit}>
                <div className="search__container">
                    <div className="search__input-from">
                        <Autocomplete
                            disablePortal
                            options={airportList}
                            getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Nơi đi" />}
                        />
                    </div>
                    <div className="search__input__icon">
                        <AutorenewIcon />
                    </div>
                    <div className="search__input-to">
                        <Autocomplete
                            disablePortal
                            options={airportList}
                            getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Nơi đến" />}
                        />
                    </div>
                    <div className="search__btn">
                        <Button variant='contained' style={{color: "white"}}>Tìm kiếm</Button>
                    </div>
                </div>
            </FormGroup>
        </div>}
        </>
    )
}