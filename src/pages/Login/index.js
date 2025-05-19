import './Login.scss';
import Logo from '../../image/logoFT.png';
import { Box, Typography } from '@mui/material';

export default function Login() {
    return (
        <div className="login-main">
            <div className="login__form">
                <div className="login__form__logo">
                    <img src={Logo} alt="logo here" />
                </div>
                <div className="login__form__main">
                    <Box component="form">
                        <Typography variant="h5" mb={2}>ĐĂNG NHẬP</Typography>
                    </Box>
                </div>
            </div>
        </div>
    )
}