import './Register.scss';
import Logo from '../../image/logoFT.png';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
// import { useState } from 'react';

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const checkUser = await axios.get('http://localhost:5000/api/users/check', {
                params: {
                    email: data.email,
                    password: data.password
                }
            });

            if (checkUser.data.exists) {
                alert('Người dùng đã tồn tại!');
                return;
            }

            await axios.post('http://localhost:5000/api/users', {
                name: data.name,
                email: data.email,
                password: data.password,
                phone_number: data.phone_number
            });

            alert('Đăng ký user thành công!');
            navigate('/login');
        } catch (err) {
            console.error('Lỗi khi đăng ký:', err);
            alert('Lỗi khi đăng ký, vui lòng thử lại');
        }
    };

    return (
        <div className="register-main">
            <div className="register__form">
                <div className="register__form__logo">
                    <Link to='/'>
                        <img src={Logo} alt="logo here" />
                    </Link>
                </div>
                <div className="register__form__main">
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h5" mb={2}>ĐĂNG KÍ</Typography>
                        <Grid container spacing={2}>
                            <Grid item size={12}>
                                <TextField
                                    {...register("name", { required: "Họ và tên là bắt buộc" })}
                                    label="Họ và tên"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Grid>

                            <Grid item size={12}>
                                <TextField
                                    {...register("email", { required: "Email là bắt buộc" })}
                                    label="Email"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>

                            <Grid item size={12}>
                                <TextField
                                    {...register("phone_number", { required: "Số điện thoại là bắt buộc" })}
                                    label="Số điện thoại"
                                    fullWidth
                                    error={!!errors.phone_number}
                                    helperText={errors.phone_number?.message}
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
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    style={{ color: 'white' }}
                                >
                                    ĐĂNG KÍ
                                </Button>
                            </Grid>

                            <Grid item size={12}>
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="primary"
                                    fullWidth
                                >
                                    ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP NGAY
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
        </div>
    );
}