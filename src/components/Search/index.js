import { Autocomplete, Button, TextField } from '@mui/material';
import './Search.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';
// import { FormGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { getAirportList } from '../../services/airportServices';
import { useNavigate } from 'react-router';

export default function Search() {
    const [airportList, setAirportList] = useState();
    const navigate = useNavigate();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        const query = new URLSearchParams();
        if (from) query.set('from', from);
        if (to) query.set('to', to);
        // if (dateRange[0].startDate)
        // query.set('departure', format(dateRange[0].startDate, 'yyyy-MM-dd'));
        // if (dateRange[0].endDate)
        // query.set('return', format(dateRange[0].endDate, 'yyyy-MM-dd'));
        // if (selectedAirlines.length > 0)
        // query.set('airlines', selectedAirlines.join(','));

        navigate(`/get-ticket?${query.toString()}`);
        // console.log('submitted');
        // alert('submitted');
    };

    useEffect(() => {
        const fetchApi = async () => {
            const resultAirport = await getAirportList();
            if (resultAirport) {
                // console.log(resultAirport);
                setAirportList(resultAirport);
            }
        };

        fetchApi();
    }, [])

    return (
        <>
            {airportList && <div className="search">
                    <form onSubmit={handleSearch}>
                        <div className="search__container">
                            <div className="search__input-from">
                                <Autocomplete
                                    disablePortal
                                    options={airportList}
                                    getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Nơi đi" />}
                                    onChange={(e) => setFrom(e.target.value)}
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
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                            <div className="search__btn">
                                <Button type='submit' variant='contained' style={{color: "white"}}>Tìm kiếm</Button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}