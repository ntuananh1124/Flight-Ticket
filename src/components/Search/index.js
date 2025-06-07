import { Autocomplete, Button, TextField } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useEffect, useState } from 'react';
import { getAirportListAxios } from '../../services/airportServices';
import { useNavigate, useSearchParams } from 'react-router';
import './Search.scss';

export default function Search() {
    const [airportList, setAirportList] = useState([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    useEffect(() => {
        const fetchApi = async () => {
            const resultAirport = await getAirportListAxios();
            if (resultAirport) setAirportList(resultAirport);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const urlFrom = searchParams.get('from');
        const urlTo = searchParams.get('to');

        if (urlFrom) setFrom(urlFrom);
        if (urlTo) setTo(urlTo);
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = new URLSearchParams();
        if (from) query.set('from', from);
        if (to) query.set('to', to);

        navigate(`/get-ticket?${query.toString()}`);
    };

    return (
        <>
            {airportList.length > 0 && (
                <div className="search">
                    <form onSubmit={handleSearch}>
                        <div className="search__container">
                            <div className="search__input-from">
                                <Autocomplete
                                    disablePortal
                                    options={airportList}
                                    getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.location}`}
                                    sx={{ width: '100%' }}
                                    value={airportList.find(opt => opt.code === from) || null}
                                    onChange={(event, newValue) => setFrom(newValue?.code || '')}
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
                                    value={airportList.find(opt => opt.code === to) || null}
                                    onChange={(event, newValue) => setTo(newValue?.code || '')}
                                    renderInput={(params) => <TextField {...params} label="Nơi đến" />}
                                />
                            </div>

                            <div className="search__btn">
                                <Button type='submit' variant='contained' style={{ color: 'white' }}>Tìm kiếm</Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}