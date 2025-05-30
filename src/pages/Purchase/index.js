import './Purchase.scss';
import { Button, Card, Checkbox, FormControl, Grid, Paper, Slide, Step, StepLabel, Stepper, TextField } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import CheckOutModal from '../CheckOutModal';
import { forwardRef, useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CountrySelect from '../../components/CountrySelect';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const steps = [
    'Thông tin đặt vé',
    'Xem lại & thanh toán',
    'Xác nhận vé',
];

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Purchase() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog]  = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        // setOpen(false);
        handleDialogOpen(true);
    };
    const [activeStep, setActiveStep] = useState(0);

    const handleClickPurchase = () => {
        setActiveStep((activeStepCrr) => ++activeStepCrr);
    };

    const handleFinish = () => {
        setOpen(false);
        setOpenDialog(false);
        setActiveStep(0);
    }

    return (
        <>
            <div className="purchase-main">
                <div className="my-container">
                    <div className="purchase-main__content">
                        <h2>CÁC CHUYẾN BAY</h2>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Paper elevation={3}>
                                    <div className="purchase-main__item">
                                        <Checkbox className="checkbox-custom" {...label} />
                                        <div className="purchase-main__flight-content__inner">
                                            <div className="purchase-main__flight-content__inner__airline">
                                                <div className="purchase-main__flight-content__inner__airline__img">
                                                    <img src="" alt="logo-here" />
                                                </div>
                                                <div className="purchase-main__flight-content__inner__airline__name">
                                                    <span>Vietjet Air</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__route">
                                                <div className="purchase-main__flight-content__inner__route__from">
                                                    <span>23:50</span>
                                                    <span>HAN</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__time">
                                                    <span>2h 10m</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__to">
                                                    <span>02:00</span>
                                                    <span>SGN</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__prices">
                                                <span>First</span>
                                                <span className="price">450$</span>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid size={12}>
                                <Paper elevation={3}>
                                    <div className="purchase-main__item">
                                        <Checkbox className="checkbox-custom" {...label} />
                                        <div className="purchase-main__flight-content__inner">
                                            <div className="purchase-main__flight-content__inner__airline">
                                                <div className="purchase-main__flight-content__inner__airline__img">
                                                    <img src="" alt="logo-here" />
                                                </div>
                                                <div className="purchase-main__flight-content__inner__airline__name">
                                                    <span>Vietjet Air</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__route">
                                                <div className="purchase-main__flight-content__inner__route__from">
                                                    <span>01:00</span>
                                                    <span>SGN</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__time">
                                                    <span>2h 10m</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__to">
                                                    <span>03:10</span>
                                                    <span>HAN</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__prices">
                                                <span>First</span>
                                                <span className="price">450$</span>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid size={12} justifySelf={'right'}>
                                <h4>Tổng giá tiền: 500$</h4>
                            </Grid>
                            <Grid size={12}>
                                <div className="purchase-main__submit">
                                    <Button onClick={handleOpen} variant='contained' style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}> <span>THANH TOÁN</span> <ArrowCircleRightIcon />
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            <Modal
                style={{zIndex: '1200', width: '100vw'}}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{marginBottom: '30px'}}>
                        THANH TOÁN
                    </Typography>
                    <Box sx={{ width: '100%' }}>
                        <Stepper style={{marginBottom: '20px'}} activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                            ))}
                        </Stepper>
                        {activeStep === 0 && <Card elevation={0}>
                            <FormControl style={{marginTop: '20px'}} fullWidth>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <TextField fullWidth required id="outlined-basic" label="Họ và tên" variant="outlined"/>
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth required id="outlined-basic" label="Email" variant="outlined" />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth required id="outlined-basic" label="Số điện thoại" variant="outlined" />
                                    </Grid>
                                    <Grid size={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="Ngày tháng năm sinh" />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid size={6}>
                                        <CountrySelect />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField fullWidth required id="outlined-basic" label="Số CCCD/Hộ chiếu" variant="outlined" />
                                    </Grid>
                                    <Grid size={12}>
                                        <Button onClick={handleClickPurchase} color='primary' variant='contained' style={{color: 'white'}}>TIẾP THEO</Button>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Card>}
                        {activeStep === 1 && <div>
                                bước 2
                                <Button onClick={handleClickPurchase} color='primary' variant='contained' style={{color: 'white'}}>TIẾP THEO</Button>
                            </div>}
                        {activeStep === 2 && <>bước 3 <Button onClick={handleFinish} color='primary' variant='contained' style={{color: 'white'}}>HOÀN TẤT</Button></>}
                    </Box>
                </Box>
            </Modal>
            <Dialog 
                open={openDialog}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleDialogClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Đang thanh toán, bạn muốn quay lại chứ?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Bằng cách nhấn vào <b>HỦY THANH TOÁN</b>, bạn sẽ hủy bỏ việc điền thông tin và thanh toán. <br />Để tiếp tục điền thông tin và thanh toán bạn nhấn <b>TIẾP TỤC</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setOpen(false); setOpenDialog(false)}}>HỦY THANH TOÁN</Button>
                    <Button onClick={handleDialogClose}>TIẾP TỤC</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}