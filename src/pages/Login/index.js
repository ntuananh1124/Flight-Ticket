import './Login.scss';
import Logo from '../../image/logoFT.png';
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // const onSubmit = (data) => {
    //     console.log(data);
    // }

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
                        <form onSubmit={handleSubmit((data) => console.log(data))}>
                            <Grid container spacing={2}>
                                <Grid item size={12}>
                                    <TextField
                                        {...register("email", { required: "Email là bắt buộc" })}
                                        label="Email đăng nhập"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                </Grid>

                                <Grid item size={12}>
                                    <TextField
                                        {...register("password", { required: "Mật khẩu là bắt buộc" })}
                                        label="Mật khẩu"
                                        type="password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                </Grid>

                                <Grid item size={12}>
                                    <InputLabel>Vai trò</InputLabel>
                                    <Select
                                        fullWidth
                                        defaultValue="Người dùng"
                                        {...register("role")}
                                    >
                                        <MenuItem value="Người dùng">Người dùng</MenuItem>
                                        <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item size={12}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type="submit"
                                        fullWidth
                                        style={{color: 'white'}}
                                    >
                                        ĐĂNG NHẬP
                                    </Button>
                                </Grid>

                                <Grid item size={12}>
                                    <Button
                                        component={Link}
                                        to="/register"
                                        color="primary"
                                        fullWidth
                                    >
                                        CHƯA CÓ TÀI KHOẢN? ĐĂNG KÍ NGAY
                                    </Button>
                                </Grid>
                            </Grid>
                            </form>
                    </Box>
                </div>
            </div>
        </div>
    )
}