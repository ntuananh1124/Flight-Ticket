import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './Carousel.scss';
import '../../styles/styles.scss';
import { useEffect, useRef } from "react";

export default function Carousel() {
    const sliderRef = useRef();

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickPlay();
        }
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        cssEase: "linear",
    };
    return (
        <div className="carousel-main">
            {typeof window !== "undefined" && (    
                <Slider {...settings}>
                    <div className="content-slide-1">
                        <div className="text-1">
                            <h2>Cùng chúng tôi chinh phục những miền đất mới đầy kỳ thú</h2>
                        </div>
                        <div className="text-2">
                            <span>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</span>
                        </div>
                    </div>
                    <div className="content-slide-2">
                        <div className="text-1">
                            <h2>Trải nghiệm thế giới theo cách của bạn cùng dịch vụ du lịch chuyên nghiệp</h2>
                        </div>
                        <div className="text-2">
                            <span>Từ bãi biển đến đỉnh núi, từ thành thị đến nông thôn – hãy để chúng tôi biến giấc mơ du lịch của bạn thành hiện thực.</span>
                        </div>
                    </div>
                    <div className="content-slide-3">
                        <div className="text-1">
                            <h2>Mở rộng tầm mắt – Khám phá thế giới với những hành trình đáng giá</h2>
                        </div>
                        <div className="text-2">
                            <span>Chúng tôi không chỉ dẫn bạn đi, mà còn mang đến những cảm xúc chân thật và giá trị khó quên trong từng bước chân.</span>
                        </div>
                    </div>
                    <div className="content-slide-4">
                        <div className="text-1">
                            <h2>Tạo nên dấu ấn cá nhân qua mỗi chuyến đi tuyệt vời</h2>
                        </div>
                        <div className="text-2">
                            <span>Dù bạn thích khám phá, thư giãn hay phiêu lưu – hành trình của bạn sẽ được thiết kế riêng, chỉ dành cho bạn.</span>
                        </div>
                    </div>
                </Slider>
            )}
        </div>
    );
}