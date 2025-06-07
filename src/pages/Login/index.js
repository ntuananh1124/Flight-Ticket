import './Login.scss';
import Logo from '../../image/logoFT.png';
import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { checkUserAxios } from '../../services/userServices';
import { setCookie } from '../../helpers/cookie';
import { checkAdminAxios } from '../../services/adminsServices';
import { generateToken } from '../../helpers/token';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        // console.log('chay trong onSubmit', data);
        if (data.role === 'Người dùng') {
            const checkLogin = await checkUserAxios(data.email, data.password);

            if (checkLogin && checkLogin.exists === false) {
                // console.log(checkLogin);
                alert('Sai thông tin đăng nhập!');
            } else if (checkLogin && checkLogin.exists === true) {
                setCookie("user_id", checkLogin.user.user_id);
                setCookie("username", checkLogin.user.name);
                setCookie("user_email", checkLogin.user.email);
                setCookie("user_number", checkLogin.user.phone_number);
                setCookie("user_token", generateToken(20));
                navigate('/');
                alert('Đăng nhập thành công');
            }
        } else {
            const checkAdminLogin = await checkAdminAxios(data.email, data.password);

            if (checkAdminLogin && checkAdminLogin.exists === false) {
                alert('Sai thông tin đăng nhập ADMIN!');
            } else if (checkAdminLogin && checkAdminLogin.exists === true) {
                setCookie("admin_id", checkAdminLogin.admin.admin_id);
                setCookie("admin_name", checkAdminLogin.admin.username);
                setCookie("admin_role", checkAdminLogin.admin.role);
                setCookie("admin_token", generateToken(20));
                navigate('/admin');
                alert('Đăng nhập thành công vào trang Quản trị!');
            }
        }
    }

    return (
        <div className="login-main">
            <div className="login__form">
                <div className="login__form__logo">
                    <Link to='/'>
                        <img src={Logo} alt="logo-here" />
                    </Link>
                </div>
                <div className="login__form__main">
                    <Box component="form" onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <Typography variant="h5" mb={2}>ĐĂNG NHẬP</Typography>
                        {/* <form > */}
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
                            {/* </form> */}
                    </Box>
                </div>
            </div>
        </div>
    )
}