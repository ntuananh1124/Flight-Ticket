import { Button, TextField } from '@mui/material';
import './Search.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { FormGroup } from '@mui/material';

export default function Search() {
    const handleSubmit = () => {
        console.log('submitted');
    };

    return (
        <div className="search">
            <FormGroup onSubmit={handleSubmit}>
                <div className="search__container">
                    <div className="search__input-from">
                        <TextField fullWidth id="standard-basic" label="Nơi đi" variant="standard" />
                    </div>
                    <div className="search__input__icon">
                        <AutorenewIcon />
                    </div>
                    <div className="search__input-to">
                        <TextField fullWidth id="standard-basic" label="Nơi đến" variant="standard" />
                    </div>
                    <div className="search__btn">
                        <Button>Search</Button>
                    </div>
                </div>
            </FormGroup>
        </div>
    )
}