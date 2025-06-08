import { Button, Card, Grid, Switch, TextField } from '@mui/material';
import './UserInfo.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../../helpers/cookie';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function UserInfo() {
    const [isEditOff, setEditOff] = useState(true);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    const userId = getCookie("user_id");

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setUserInfo(response.data);
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };
        fetchUserInfo();
    }, [userId]);

    const handleEdit = () => {
        setEditOff(!isEditOff);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'name') {
            setErrors(prev => ({
                ...prev,
                name: value.trim() !== '' ? '' : 'Họ và tên không được để trống'
            }));
        }

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors(prev => ({
                ...prev,
                email: emailRegex.test(value) ? '' : 'Email không hợp lệ'
            }));
        }

        if (name === 'phone_number') {
            const phoneRegex = /^\d{9,11}$/;
            setErrors(prev => ({
                ...prev,
                phone_number: phoneRegex.test(value) ? '' : 'Số điện thoại không hợp lệ'
            }));
        }
    };

    const handleSave = async () => {
        if (errors.name || errors.email || errors.phone_number) {
            alert("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/users/${userId}`, userInfo);
            alert("Cập nhật thành công!");
            setEditOff(true);
        } catch (err) {
            console.log("Error updating user info:", err);
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <>
            <div className="user-info">
                <div className="my-container">
                    <div className="user-info__main">
                        <div className="user-info__inner">
                            <Card elevation={2} style={{ padding: '20px' }}>
                                <div className='user-info__inner__title'>
                                    <h2>HỒ SƠ CỦA BẠN</h2>
                                    <div className="toggle">
                                        <label>Chế độ chỉnh sửa</label>
                                        <Switch onChange={handleEdit} checked={!isEditOff} {...label} />
                                    </div>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            value={userInfo.name}
                                            onChange={handleChange}
                                            label="Họ và tên"
                                            variant="standard"
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleChange}
                                            label="Email"
                                            variant="standard"
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            name="phone_number"
                                            value={userInfo.phone_number}
                                            onChange={handleChange}
                                            label="Số điện thoại"
                                            variant="standard"
                                            error={!!errors.phone_number}
                                            helperText={errors.phone_number}
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            value={userInfo.password}
                                            onChange={handleChange}
                                            label="Mật khẩu"
                                            type="password"
                                            variant="standard"
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant='contained'
                                            style={{ color: 'white' }}
                                            onClick={handleSave}
                                            disabled={isEditOff}
                                        >
                                            LƯU
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}