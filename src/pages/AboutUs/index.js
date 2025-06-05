import "./AboutUs.scss";
import Beach from '../../image/about-us/sun.png';
import b1 from '../../image/about-us/1.png';
import b2 from '../../image/about-us/2.png';
import b3 from '../../image/about-us/3.png';

export default function AboutUs() {
    return (
        <section className="about-page">
            <div className="about-hero">
                <div className="container">
                <h1 className="main-title">Về chúng tôi</h1>
                <p className="subtitle">Khám phá thế giới cùng FlightTicket</p>
                </div>
            </div>

            <div className="about-content my-container">
                <div className="section">
                <h2>Hành trình phát triển</h2>
                <p>
                    FlightTicket tự hào là một trong những công ty hàng đầu trong lĩnh vực du lịch và hàng không tại Việt Nam. Chúng tôi đã và đang đồng hành cùng hàng triệu khách hàng trên khắp thế giới với cam kết mang đến những trải nghiệm bay và du lịch tuyệt vời nhất.
                </p>
                </div>

                <div className="section">
                <h2>Sứ mệnh</h2>
                <p>
                    Sứ mệnh của FlightTicket là kết nối mọi người đến gần nhau hơn qua những hành trình ý nghĩa. Chúng tôi không ngừng đổi mới và phát triển để phục vụ khách hàng một cách tốt nhất.
                </p>
                </div>

                <div className="section">
                <h2>Tầm nhìn</h2>
                <p>
                    Trở thành thương hiệu hàng đầu khu vực Châu Á trong lĩnh vực hàng không và du lịch, góp phần thúc đẩy phát triển kinh tế và giao lưu văn hóa giữa các quốc gia.
                </p>
                </div>

                <div className="section explore">
                <h2 className="explore-title">THẾ GIỚI LÀ CỦA BẠN.<br />CHÚNG TÔI SẼ GIÚP BẠN KHÁM PHÁ.</h2>
                <div className="explore-columns">
                    <div className="explore-item">
                    <h3>Chuyến bay</h3>
                    <p>
                        Từ những kỳ nghỉ ngắn ngày cho đến cuộc phiêu lưu hoành tráng, hãy tìm mức giá tốt nhất trong hàng triệu chuyến bay ở đây. Không phí ẩn. Không phí phát sinh.
                    </p>
                    <p>
                        Bạn có thể dùng bộ lọc tìm kiếm thông minh, chẳng hạn như số điểm dừng và thời gian khởi hành, để tìm chuyến bay hoàn hảo. Ngoài ra, chúng tôi còn có vô số mẹo và bí quyết giúp bạn tiết kiệm hơn nữa.
                    </p>
                    </div>

                    <div className="explore-item">
                    <h3>Khách sạn</h3>
                    <p>
                        Di chuyển mới chỉ là một phần của hành trình. Chúng tôi luôn sẵn sàng giúp bạn có được chuyến đi hoàn hảo với hàng triệu căn phòng trên khắp thế giới, từ giá rẻ tới cao cấp.
                    </p>
                    <p>
                        So sánh những tên tuổi lớn nhất ngay tại đây. Bạn thậm chí còn tiết kiệm được hơn nữa khi hưởng mức giá ưu đãi ở các khách sạn hàng đầu thế giới.
                    </p>
                    </div>

                    <div className="explore-item">
                    <h3>Thuê xe</h3>
                    <p>
                        Bạn sẽ dễ dàng tìm kiếm, so sánh và đặt xe phù hợp với nhu cầu. Từ dòng xe SUV gia đình tới xe mui trần sang trọng, bạn sẽ nhận được mức giá tốt nhất cho mọi loại xe.
                    </p>
                    <p>
                        Chúng tôi xếp hạng mỗi ưu đãi dựa trên chính sách xăng xe, địa điểm đón và bảo hiểm để bạn có thể đưa ra lựa chọn tốt nhất cho mình.
                    </p>
                    </div>
                </div>
                </div>

                <div className="section sustainability">
                <div className="sustainability-text">
                    <h2>CÁC BƯỚC CỦA CHÚNG TÔI ĐỂ TIẾN ĐẾN SỰ BỀN VỮNG</h2>
                    <p>Chúng tôi cam kết cộng tác với các đối tác để góp phần định hình hoạt động du lịch có trách nhiệm hơn trong tương lai.</p>
                </div>
                <div className="sustainability-image">
                    <img src={Beach} alt="Bãi biển" />
                </div>
                </div>

                <div className="section cards">
                <div className="card">
                    <img src={b1} alt="Vì sao nên chọn Fly Corp?" />
                    <h3>Vì sao nên chọn FlightTicket?</h3>
                    <p>Chúng tôi luôn bên bạn. Hãy cùng tìm hiểu nhé!</p>
                </div>
                <div className="card">
                    <img src={b2} alt="Nguồn nhân lực" />
                    <h3>Nguồn nhân lực</h3>
                    <p>Chúng tôi là ai, chúng tôi ở đâu và hoạt động như thế nào.</p>
                </div>
                <div className="card">
                    <img src={b3} alt="Truyền thông" />
                    <h3>Truyền thông</h3>
                    <p>Tin tức mới nhất, sự kiện quan trọng và chi tiết liên hệ của chúng tôi.</p>
                </div>
                </div>
            </div>
        </section>
    );
}