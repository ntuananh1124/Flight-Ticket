import { Grid } from "@mui/material";
import Carousel from "../../components/Carousel";
import './Home.scss';
import { airlinesList } from '../../utils/airlinesList.js';

export default function Home() {
    return (
        <div className="main-content">
            <div className="carousel">
                <Carousel />
            </div>
            {/* Section 1 */}
            <div className="section-1">
                <div className="search">

                </div>
            </div>
            {/* Section 2 */}
            <div className="section-2">
                <div className="section-2__main my-container">
                    <div className="section-2__main__title">
                        <h2>TOP HÃNG HÀNG KHÔNG PHỔ BIẾN</h2>
                    </div>
                    <div className="section-2__main__desc">
                        <p>Trải nghiệm các hãng hàng không phổ biến với giá rẻ qua <b>Flight Ticket</b></p>
                    </div>
                    <div className="section-2__main__content">
                        <Grid container spacing={4}>
                            {airlinesList && airlinesList.map((airline, index) =>
                                <Grid size={3} key={index + 1}>
                                    <div className="section-2__main__content__inner">
                                        <div className="section-2__main__content__inner__img">
                                            <img src={airline.image} alt="logo here" />
                                        </div>
                                        <div className="section-2__main__content__inner__desc">
                                            <h4>{airline.name}</h4>
                                            <p>{airline.desc}</p>
                                        </div>
                                    </div>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </div>
            </div>
            {/* Section 3 */}
            <div className="section-3">
                <div className="section-2__main my-container">
                    <div className="section-2__main__title">
                        <h2>TOP ĐIỂM ĐẾN HÀNG ĐẦU</h2>
                    </div>
                    <div className="section-2__main__desc" style={{textAlign: 'center'}}>
                        <h1>Nơi Văn Hóa Giao Thoa Cùng Phiêu Lưu – Cùng Chúng Tôi Khám Phá Thế Giới Rộng Lớn</h1>
                        <p>Hãy bắt đầu hành trình khám phá những vùng đất mới, nơi mỗi bước chân là một cuộc phiêu lưu kỳ thú và mỗi điểm đến đều ẩn chứa vẻ đẹp văn hóa đặc sắc. Cùng chúng tôi trải nghiệm thế giới theo cách độc đáo và đáng nhớ nhất.</p>
                    </div> 
                    <div className="section-2__main__content">
                            
                    </div>       
                </div>
            </div>
        </div>
    )
}