import { Grid } from "@mui/material";
import Carousel from "../../components/Carousel";
import './Home.scss';
import { airlinesList } from '../../utils/airlinesList.js';
import Img1 from '../../image/how-it-works.png';
import Icon1 from '../../image/icon/folder-search.svg';
import Icon2 from '../../image/icon/map-people.svg';
import Icon3 from '../../image/icon/mobile-payment.svg';
import Icon4 from '../../image/icon/notes-edit-search.svg';
import Search from "../../components/Search/index.js";

export default function Home() {
    return (
        <div className="main-content">
            <div className="carousel">
                <Carousel />
            </div>
            {/* Section 1 */}
            <div className="section-1">
                <Search />
            </div>
            {/* Section 2 */}
            <div className="section-2">
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
            {/* Section 3 */}
            <div className="section-3">
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

            {/* Section 4 */}
            <div className="section-4">
                <div className="section-2__main my-container">
                    <div className="section-2__main__title">
                        <h2>ĐẶT VÉ TỐI ƯU</h2>
                    </div>
                    <div className="section-2__main__content">
                        <div className="section-4__content">
                            <div className="section-4__content__left">
                                <div className="section-4__content__left__img">
                                    <img src={Img1} alt="image-here" />
                                </div>
                            </div>
                            <div className="section-4__content__right">
                                <ul>
                                    <li>
                                        <div className="content__right">
                                            <div className="content__right__icon">
                                                <img src={Icon1} alt="icon" />
                                            </div>
                                            <div className="content__right__text">
                                                <h3>Tìm điểm đến của bạn</h3>
                                                <p>Đắm mình trong thế giới của các chuyên gia du lịch, nhận được thông tin toàn diện về chuyến đi của bạn. Ở đây, bạn sẽ tìm thấy lời khuyên chính xác và chi tiết về các chuyến bay, giá vé, và thông tin thiết yếu về điểm đến của bạn.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="content__right">
                                            <div className="content__right__icon">
                                                <img src={Icon2} alt="icon" />
                                            </div>
                                            <div className="content__right__text">
                                                <h3>Đặt vé</h3>
                                                <p>Chỉ với vài cú nhấp chuột, bạn có thể chọn chuyến bay ưa thích của mình và điền vào thông tin cá nhân của mình. Quá trình đặt vé là nhanh chóng và đơn giản, tiết kiệm thời gian và đảm bảo một vé cho chuyến đi mới của bạn.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="content__right">
                                            <div className="content__right__icon">
                                                <img src={Icon3} alt="icon" />
                                            </div>
                                            <div className="content__right__text">
                                                <h3>Thực hiện thanh toán</h3>
                                                <p>Hãy yên tâm với các phương thức thanh toán linh hoạt và an toàn. Chúng tôi chấp nhận các hình thức thanh toán khác nhau, từ thẻ tín dụng đến chuyển khoản ngân hàng, đảm bảo sự tiện lợi tối đa cho trải nghiệm của bạn.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="content__right">
                                            <div className="content__right__icon">
                                                <img src={Icon4} alt="icon" />
                                            </div>
                                            <div className="content__right__text">
                                                <h3>Khám phá các điểm đến</h3>
                                                <p>Sau khi hoàn thành thanh toán, hãy dành thời gian khám phá điểm đến của bạn. Tìm hiểu về văn hoá địa phương, thời tiết, và những trải nghiệm độc đáo đang chờ bạn khi bạn đến.</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )
}