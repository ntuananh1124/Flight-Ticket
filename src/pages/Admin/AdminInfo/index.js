import { Button, Card, Grid, Switch, TextField } from '@mui/material';
import './AdminInfo.scss';
import { useState } from 'react';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function AdminInfo() {
    const [isEditOff, setEditOff] = useState(true);
    const handleEdit = () => {
        setEditOff(!isEditOff);
    };
    return (
        <>
            <div className="user-info">
                <div className="my-container">
                    <div className="user-info__main">
                        <div className="user-info__inner">
                            <Card elevation={2} style={{padding: '20px'}}>
                                <div className='user-info__inner__title'>
                                    <h2>HỒ SƠ CỦA BẠN</h2>
                                    <div className="toggle">
                                        <label>Chế độ chỉnh sửa</label>
                                        <Switch onChange={handleEdit} {...label} />
                                    </div>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextField fullWidth defaultValue={'Nghiêm Tuấn Anh'} id="standard-basic" slotProps={{input: {readOnly: isEditOff,}}} label="Họ và tên" variant="standard" />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth defaultValue={'ntuananh1124@gmail.com'} id="standard-basic" slotProps={{input: {readOnly: isEditOff,}}} label="Email" variant="standard" />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth defaultValue={'ntuananh1124@gmail.com'} id="standard-basic" slotProps={{input: {readOnly: isEditOff,}}} label="Số điện thoại" variant="standard" />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth defaultValue={'ntuananh1124@gmail.com'} id="standard-basic" slotProps={{input: {readOnly: isEditOff,}}} label="Mật khẩu" type="password" variant="standard" />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField fullWidth defaultValue={'Quản lý'} id="standard-basic" slotProps={{input: {readOnly: isEditOff,}}} label="Chức vụ" variant="standard" />
                                    </Grid>
                                    <Grid size={12}>
                                        <Button variant='contained' style={{color: 'white'}}>LƯU</Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}