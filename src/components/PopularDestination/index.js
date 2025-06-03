import { useEffect, useRef } from "react";
import Slider from "react-slick";
// import './PopularDestination.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Europe from '../../image/popular/europe.jpg';
import Africa from '../../image/popular/africa.jpg';
import Asian from '../../image/popular/asian.jpg';
import SouthestAsia from '../../image/popular/southest_asia.jpg';
import Usa from '../../image/popular/usa.jpg';
import Vietnam from '../../image/popular/vietnam.jpg';

export default function PopularDestination() {
    const sliderRef = useRef();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,            // thêm dòng này
        autoplaySpeed: 3000,  
    };

    useEffect(() => {
        // if (sliderRef.current) {
        //     sliderRef.current.slickPlay();
        // }
    }, []);
    
    return (
        <div className="popular-desti">
            <Slider ref={sliderRef} {...settings}>
                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={Europe} alt="img"/>
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>
            
                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={Africa} alt="img"/>
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>
            
                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={Asian} alt="img"/>
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>
            
                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={SouthestAsia} alt="img"/>
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>

                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={Usa} alt="img"/>
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>

                <div className="content-slide">
                    <div className="content-slide__img">
                        <img src={Vietnam} alt="img" />
                    </div>
                    <div className="content-slide__text">
                        <p>Mỗi hành trình là một câu chuyện riêng – chúng tôi sẽ giúp bạn viết nên những kỷ niệm khó quên qua từng chuyến đi.</p>
                    </div>
                </div>
            </Slider>
        </div>
    )
}