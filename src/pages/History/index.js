import { Grid, Paper } from "@mui/material";
import './History.scss';

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function History() {
    return (
        <>
            <div className="user-history">
                <div className="my-container">
                    <div className="user-history-main">
                        <h2>CHUYẾN BAY CỦA BẠN</h2>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Paper elevation={3}>
                                    <div className="purchase-main__item">
                                        <div className="user-history-main__status">
                                            <div className="user-history-main__status__inner">
                                                <span>Đã thanh toán</span>
                                            </div>
                                        </div>
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
                        </Grid>
                    </div>
                </div>
            </div>
        </>
    )
}