import { Button, Card, Grid, Switch, TextField, Autocomplete } from '@mui/material';
import './AdminInfo.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const roles = ['Manager', 'Staff'];

export default function AdminInfo() {
    const [isEditOff, setEditOff] = useState(true);
    const [adminData, setAdminData] = useState({
        username: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admins');
            // Giả sử chỉ lấy admin_id = 1
            const admin = res.data.find(a => a.admin_id === 1);
            if (admin) {
                setAdminData({
                    username: admin.username,
                    password: admin.password,
                    role: admin.role
                });
            }
        } catch (err) {
            console.error('Lỗi fetch admin:', err);
        }
    };

    const handleEdit = () => {
        setEditOff(!isEditOff);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value });
    };

    const handleRoleChange = (event, newValue) => {
        setAdminData({ ...adminData, role: newValue });
    };

    const handleSave = async () => {
        if (!adminData.username || !adminData.password || !adminData.role) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/admins/1`, adminData);
            alert('Cập nhật thành công');
            setEditOff(true);
        } catch (err) {
            console.error('Lỗi khi update admin:', err);
            alert('Lỗi khi update admin');
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
                                    <Grid item size={6}>
                                        <TextField
                                            fullWidth
                                            name="username"
                                            value={adminData.username}
                                            onChange={handleChange}
                                            label="Tài khoản"
                                            variant="standard"
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item size={6}>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            value={adminData.password}
                                            onChange={handleChange}
                                            label="Mật khẩu"
                                            type="password"
                                            variant="standard"
                                            InputProps={{ readOnly: isEditOff }}
                                        />
                                    </Grid>
                                    <Grid item size={12}>
                                        <Autocomplete
                                            disablePortal
                                            options={roles}
                                            value={adminData.role}
                                            onChange={handleRoleChange}
                                            renderInput={(params) => <TextField {...params} label="Chức vụ" variant="standard" />}
                                            readOnly={isEditOff}
                                            disabled={isEditOff}
                                        />
                                    </Grid>
                                    <Grid item size={12}>
                                        <Button variant='contained' style={{ color: 'white' }} onClick={handleSave} disabled={isEditOff}>
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
