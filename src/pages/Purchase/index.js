import './Purchase.scss';
import { Button, Card, Checkbox, CircularProgress, FormControl, Grid, Paper, Slide, Step, StepLabel, Stepper, TextField } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
// import CheckOutModal from '../CheckOutModal';
import { forwardRef, useEffect, useState } from 'react';
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
    width: '80vw',
    maxHeight: '95vh',
    bgcolor: 'white',
    p: 3,
    overflowY: 'auto', // scroll nội dung khi vượt chiều cao
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2,
    boxShadow: 24,
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
    const [activeStep, setActiveStep] = useState(0);

    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(true);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        // setOpen(false);
        handleDialogOpen(true);
    };

    const handleClickPurchase = () => {
        setActiveStep((activeStepCrr) => ++activeStepCrr);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleFinish = () => {
        setOpen(false);
        setOpenDialog(false);
        setActiveStep(0);
    };

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            setQrCode(''); // Clear QR trước
            try {
                const response = await fetch('https://open.oapi.vn/banking/generate-qr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE', // Thay bằng token thực tế
                    },
                    body: JSON.stringify({
                        bin: "970422",
                        accountNo: "1120048668",
                        accountName: "Nghiem Tuan Anh",
                        amount: "10000",
                        content: "Flight_Ticket"
                    }),
                });

                const result = await response.json();
                if (response.ok) {
                    setQrCode(result.data); // Có thể là base64 image hoặc chuỗi text
                    console.log(result);
                } else {
                    console.error('Lỗi:', result);
                    alert('Có lỗi xảy ra khi tạo mã QR');
                }
                } catch (error) {
                    console.error('Fetch error:', error);
                    alert('Không thể kết nối đến máy chủ');
                } finally {
                    setLoading(false);
                }
        };
        fetchApi();
    }, [activeStep])

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
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>10/06/2025</b></span>
                                                    <span>HAN</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__time">
                                                    <span>2h 10m</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__to">
                                                    <span>02:00</span>
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>11/06/2025</b></span>
                                                    <span>SGN</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__prices">
                                                <span>First</span>
                                                <span className="price">450$</span>
                                            </div>
                                            <div className="purchase-main__submit">
                                                <Button onClick={handleOpen} variant='contained' style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}> <span>THANH TOÁN</span> <ArrowCircleRightIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid size={12}>
                                <Paper elevation={3}>
                                    <div className="purchase-main__item">
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
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>10/06/2025</b></span>
                                                    <span>SGN</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__time">
                                                    <span>2h 10m</span>
                                                </div>
                                                <div className="purchase-main__flight-content__inner__route__to">
                                                    <span>03:10</span>
                                                    <span style={{color: 'green', fontSize:  '13px'}}><b>10/06/2025</b></span>
                                                    <span>HAN</span>
                                                </div>
                                            </div>
                                            <div className="purchase-main__flight-content__inner__prices">
                                                <span>First</span>
                                                <span className="price">450$</span>
                                            </div>
                                            <div className="purchase-main__submit">
                                                <Button onClick={handleOpen} variant='contained' style={{color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}> <span>THANH TOÁN</span> <ArrowCircleRightIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Paper>
                            </Grid>
                            <Grid size={12} justifySelf={'right'}>
                                <h4>Tổng giá tiền: 500$</h4>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
            <Modal
                style={{zIndex: '1200'}}
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
                                <FormControl style={{marginTop: '20px'}} fullWidth>
                                    <h2 style={{marginBottom: '20px'}}>XEM LẠI THÔNG TIN</h2>
                                    <Grid container spacing={2}>
                                        <Grid size={4}>
                                            <TextField defaultValue={'Nghiem Tuan Anh'} slotProps={{input: {readOnly: true,}}} fullWidth required id="outlined-basic" label="Họ và tên" variant="standard"/>
                                        </Grid>
                                        <Grid size={4}>
                                            <TextField defaultValue={'nghiemtuananh2004@gmail.com'} slotProps={{input: {readOnly: true,}}} fullWidth required id="outlined-basic" label="Email" variant="standard"/>
                                        </Grid>
                                        <Grid size={4}>
                                            <TextField defaultValue={'0833748190'} slotProps={{input: {readOnly: true,}}} fullWidth required id="outlined-basic" label="Số điện thoại" variant="standard"/>
                                        </Grid>
                                        <Grid size={4}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker label="Ngày tháng năm sinh" />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid size={4}>
                                            <CountrySelect />
                                        </Grid>
                                        <Grid size={4}>
                                            <TextField fullWidth defaultValue={'0833748190'} slotProps={{input: {readOnly: true,}}} required id="outlined-basic" label="Số CCCD/Hộ chiếu" variant="standard" />
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <h2 style={{marginBottom: '20px'}}>THANH TOÁN</h2>
                                            <Grid size={12}>
                                                {loading ? <CircularProgress size={'100px'} /> : <>
                                                    <img id='qrCode' src={qrCode} style={{width: '200px'}} />
                                                </>}
                                            </Grid>
                                        </Grid>
                                        <Grid size={12}>
                                            <Button onClick={handleClickPurchase} color='primary' variant='contained' style={{color: 'white', marginRight: '15px'}}>TIẾP THEO</Button>
                                            <Button onClick={handleBack} color='primary'>TRỞ LẠI</Button>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </div>}
                        {activeStep === 2 && <>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <div className="customer-info">
                                    <div className="customer-info__name">
                                        <b>Họ và tên: </b>
                                        <span>Nghiêm Tuấn Anh</span>
                                    </div>
                                    <div className="customer-info__phone">
                                        <b>Số điện thoại: </b>
                                        <span>0833748190</span>
                                    </div>
                                    <div className="customer-info__email">
                                        <b>Email: </b>
                                        <span>nghiemtuananh2004@gmail.com</span>
                                    </div>
                                    <div className="customer-info__nationality">
                                        <b>Quốc tịch: </b>
                                        <span>Vietnam</span>
                                    </div>
                                    <div className="customer-info__birth">
                                        <b>Ngày sinh: </b>
                                        <span>01/01/2004</span>
                                    </div>
                                    <div className="customer-info__id">
                                        <b>Hộ chiếu/CCCD: </b>
                                        <span>00120374955</span>
                                    </div>
                                    <div className="customer-info__seat">
                                        <b>Ghế: </b>
                                        <span>A1</span>
                                    </div>
                                    <div className="customer-info__id">
                                        <b>Hạng ghế: </b>
                                        <span>Economy</span>
                                    </div>
                                    <div className="customer-info__status">
                                        <b>Trạng thái: </b>
                                        <span>Đã thanh toán</span>
                                    </div>
                                </div>
                            </Grid>
                            <Grid size={12}>
                                <Button onClick={handleFinish} color='primary' variant='contained' style={{color: 'white'}}>HOÀN TẤT</Button>
                                <Button onClick={handleBack} color='primary'>TRỞ LẠI</Button>
                            </Grid>
                        </Grid> 
                        </>}
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
                    <Button onClick={() => {setOpen(false); setOpenDialog(false); setActiveStep(0)}}>HỦY THANH TOÁN</Button>
                    <Button onClick={handleDialogClose}>TIẾP TỤC</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}