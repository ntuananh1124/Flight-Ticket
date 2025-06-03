import "./AboutUs.scss";

export default function AboutUs() {
    return (
        <>
            <section className="about">
                <div className="container">
                    <h1 className="title">VỀ CHÚNG TÔI</h1>
                    <div className="intro">
                    <p>
                        Flight Ticket là một nền tảng đặt vé máy bay trực tuyến hàng đầu, giúp khách
                        hàng dễ dàng tìm kiếm và so sánh giá vé từ nhiều hãng hàng không khác
                        nhau. Với cam kết mang lại trải nghiệm người dùng tối ưu, Flight Ticket không
                        ngừng cải tiến để phục vụ khách hàng ngày một tốt hơn.
                    </p>
                    </div>

                    <div className="section">
                    <h2>TẦM NHÌN</h2>
                    <p>
                        Trở thành nền tảng đặt vé máy bay trực tuyến được tin tưởng nhất tại
                        Việt Nam và khu vực Đông Nam Á, mang đến sự tiện lợi, nhanh chóng và
                        minh bạch cho người dùng.
                    </p>
                    </div>

                    <div className="section">
                    <h2>SỨ MỆNH</h2>
                    <p>
                        Cung cấp giải pháp đặt vé máy bay đơn giản, hiệu quả và tiết kiệm thời
                        gian cho người dùng thông qua nền tảng công nghệ hiện đại và dịch vụ
                        chăm sóc khách hàng tận tâm.
                    </p>
                    </div>

                    <div className="section">
                    <h2>GIÁ TRỊ CỐT LÕI</h2>
                    <ul>
                        <li>Dịch vụ khách hàng tận tâm</li>
                        <li>Công nghệ tiên tiến</li>
                        <li>Minh bạch và rõ ràng</li>
                        <li>Đổi mới và cải tiến liên tục</li>
                    </ul>
                    </div>
                </div>
            </section>
        </>
    )
}