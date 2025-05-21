import './Register.scss';
import Logo from '../../image/logoFT.png';
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';

export default function Register() {
    return (
        <div className="register-main">
            <div className="register__form">
                <div className="register__form__logo">
                    <Link to='/'>
                        <img src={Logo} alt="logo here" />
                    </Link>
                </div>
                <div className="register__form__main">
                    <Box component="form">
                        <Typography variant="h5" mb={2}>ĐĂNG KÍ</Typography>
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
                                <Button color='primary' style={{color: 'white'}} variant="contained">ĐĂNG KÍ</Button>
                            </Grid>
                            <Grid size={12}>
                                <Button color='primary'>
                                    <Link to='/login'>ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP NGAY?</Link>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
        </div>
    )
}