import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import './Contact.scss';

export default function Contact() {
    return (
        <>
            <section className="contact">
                <div className="container">
                    <h1 className="title">LIÊN HỆ</h1>

                    <div className="company-info">
                    <h2>Thông tin công ty</h2>
                    <h3>THE ONE DIGI CORP</h3>
                    </div>

                    <div className="contact-grid">
                    <div className="contact-card">
                        <div className="icon">
                        <LocationOnIcon fontSize="large" />
                        </div>
                        <h4>Địa chỉ</h4>
                        <p>Bạn có thể đến công ty qua địa chỉ:</p>
                        <p>
                        Số 40 - 42, Đường Thiên Phước, Phường 9,<br />
                        Quận Tân Bình, Thành phố Hồ Chí Minh, Việt Nam
                        </p>
                    </div>

                    <div className="contact-card">
                        <div className="icon">
                        <PhoneIcon fontSize="large" />
                        </div>
                        <h4>Đường dây nóng</h4>
                        <p>Hãy gọi cho chúng tôi:</p>
                        <p>🇻🇳 1900 8248</p>
                        <p>🇻🇳 (+84) 987 309 313</p>
                        <p>🇻🇳 (+84) 979 312 913</p>
                        <p>🇻🇳 (+84) 28 6685 1317</p>
                    </div>

                    <div className="contact-card">
                        <div className="icon">
                        <EmailIcon fontSize="large" />
                        </div>
                        <h4>Email</h4>
                        <p>Gửi email cho chúng tôi tại:</p>
                        <p>booking@flycorp.vn</p>
                    </div>
                    </div>

                    <div className="section contact-map">
                    <h2>BẢN ĐỒ</h2>
                    <iframe
                        title="Google Maps"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.716929511781!2d106.64351531533465!3d10.83129299228773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee566e882a5%3A0xb00d063a0596d577!2zNDAgLSA0MiDEkMaw4budbmcgVGhpw6puIFBoxrDGoW5nLCBQaMaw4budbmcgOSwgVMOibiBCw6xuaCwgSMOgIENoaSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1717132761202!5m2!1svi!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                </div>
            </section>
        </>
    )
}