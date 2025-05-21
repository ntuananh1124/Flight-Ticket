import './Login.scss';
import Logo from '../../image/logoFT.png';
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';

export default function Login() {
    return (
        <div className="login-main">
            <div className="login__form">
                <div className="login__form__logo">
                    <Link to='/'>
                        <img src={Logo} alt="logo-here" />
                    </Link>
                </div>
                <div className="login__form__main">
                    <Box component="form">
                        <Typography variant="h5" mb={2}>ĐĂNG NHẬP</Typography>
                        <Grid container gap={2}>
                            <Grid size={12}>
                                <TextField id="standard-basic" label='Tên đăng nhập' style={{width: '100%'}}/>
                            </Grid>
                            <Grid size={12}>
                                <TextField id="standard-basic" label='Mật khẩu' type="password" style={{width: '100%'}}/>
                            </Grid>
                            <Grid size={6}>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    label="Vai trò"
                                    defaultValue={'Người dùng'}
                                >
                                    <MenuItem value="Người dùng">Người dùng</MenuItem>
                                    <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                                </Select>
                            </Grid>
                            <Grid size={12}>
                                <Button color='primary' style={{color: 'white'}} variant="contained">ĐĂNG NHẬP</Button>
                            </Grid>
                            <Grid size={12}>
                                <Button color='primary'>
                                    <Link to='/register'>CHƯA CÓ TÀI KHOẢN? ĐĂNG KÍ NGAY?</Link>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
        </div>
    )
}