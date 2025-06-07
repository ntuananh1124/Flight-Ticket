import './LayoutDefault.scss';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import Logo from '../../image/logoFT.png';
import '../../styles/styles.scss';
import Button from '@mui/material/Button';
import { Avatar, Menu, MenuItem, Paper } from '@mui/material';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaFacebookF } from "react-icons/fa";
import { deleteCookie, getCookie } from '../../helpers/cookie';

export default function LayoutDefault() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        // console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    function stringToColor(string) {
        let hash = 0;
        let i;
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
            bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    const token = getCookie('user_token');
    // const isAdmin = false;

    const handleLogOut = () => {
        deleteCookie('user_email');
        deleteCookie('user_id');
        deleteCookie('user_number');
        deleteCookie('username');
        deleteCookie('user_token');
        navigate('login');
    };

    return(
        <>
            <div className="content-wrapper">
                <header>
                    <div className="header my-pad">
                        <div className="header__img">
                            <NavLink to='/'>
                                <img src={Logo} alt="Logo here..." />
                            </NavLink>
                        </div>
                        <nav className="header__nav">
                            <ul>
                                <li>
                                    <NavLink to='/'>Trang chủ</NavLink>
                                </li>
                                <li className='header__nav__li-have-menu'>
                                    <NavLink to='/get-ticket'>
                                        <span>Đặt vé</span>
                                        <ArrowDropDownIcon />
                                    </NavLink>
                                    <Paper className="header__nav__dropdown">
                                        <ul>
                                            <li>
                                                <span>Đặt vé nội địa</span>
                                                <Paper style={{width: '100%'}} className="header__nav__dropdown__sec">
                                                    <ul>
                                                        <li>Đặt vé đi Hà Nội</li>
                                                        <li>Đặt vé đi TP HCM</li>
                                                        <li>Đặt vé đi Đà Nẵng</li>
                                                    </ul>
                                                </Paper>
                                            </li>
                                            <li>
                                                <span>Đặt vé quốc tế</span>
                                                <Paper style={{width: '120%'}} className="header__nav__dropdown__sec">
                                                    <ul>
                                                        <li>Đặt vé đi Mỹ</li>
                                                        <li>Đặt vé đi Anh</li>
                                                        <li>Đặt vé đi Hàn Quốc</li>
                                                        <li>Đặt vé đi Trung Quốc</li>
                                                        <li>Đặt vé đi Singapore</li>
                                                        <li>Đặt vé đi Canada</li>
                                                    </ul>
                                                </Paper>
                                            </li>
                                        </ul>
                                    </Paper>
                                </li>
                                <li>
                                    <NavLink to='/about-us'>Về chúng tôi</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/contact'>Liên hệ</NavLink>
                                </li>
                            </ul>
                        </nav>
                        <div className="header__untils">
                            {token ? <>
                                <div className="header__untils__cart-user">
                                    <div className="header__untils__cart">

                                    </div>
                                    <div className="header__untils__user">
                                        <Avatar className='avatar-custom' onClick={handleClick} {...stringAvatar('Tuan Anh')} />
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                <Link to='/user-info'>Hồ sơ cá nhân</Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link to='/purchase'>Thanh toán</Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <Link to='/user-history'>Lịch sử</Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleLogOut}>
                                                <Link to='/login'>Đăng xuất</Link>
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </> : <>
                                <div className="header__untils__login-regis">
                                    <Button color='primary'>
                                        <NavLink to='/login' variant="contained" style={{color: 'white'}}>ĐĂNG NHẬP</NavLink>
                                    </Button>
                                    <Button color='primary' variant="contained">
                                        <NavLink to='/register' style={{color: 'white'}}>ĐĂNG KÍ</NavLink>
                                    </Button>
                                </div>
                            </>}
                        </div>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
                <footer className="footer">
                    <div className="my-container">
                        <div className="footer__top">
                            <div className="footer__column">
                            <div className="footer__logo">
                                <img src="/logoFT.png" alt="FLYCORP.VN" />
                                <p>Follow me</p>
                                <div className="footer__social">
                                    <FaFacebookF />
                                </div>
                                <img
                                className="footer__cert"
                                src="/cert-bct.png"
                                alt="Đã thông báo BCT"
                                />
                            </div>
                            </div>

                            <div className="footer__column">
                            <h3>Công ty</h3>
                            <ul>
                                <li>Về chúng tôi</li>
                                <li>Tuyển dụng</li>
                                <li>Tin tức</li>
                                <li>Liên hệ</li>
                            </ul>
                            </div>

                            <div className="footer__column">
                            <h3>Thông tin quan trọng</h3>
                            <ul>
                                <li>Câu hỏi thường gặp</li>
                                <li>Chính sách bảo mật</li>
                                <li>Điều khoản và điều kiện</li>
                                <li>Thuế, phí và phụ thu</li>
                                <li>Chính sách hoàn, huỷ, đổi vé</li>
                            </ul>
                            </div>

                            <div className="footer__column">
                            <h3>Liên hệ chúng tôi</h3>
                            <p>Trường Đại học Kinh doanh và Công nghệ Hà Nội Số 29A, ngõ 124 Vĩnh Tuy, Hai Bà Trưng, Hà Nội</p>
                            <p>Email: nghiemtuananh2004@gmail.com</p>
                            <p>Số điện thoại: (+84) 833748190</p>
                            </div>
                        </div>
                        <div className="footer__bottom">
                            <p>
                            Miễn trừ trách nhiệm: Flight Ticket là một đại lý tư nhân chuyên cung cấp dịch vụ bán vé máy bay và dịch vụ du lịch khác...
                            </p>
                            <p>© 2025 Toàn bộ bản quyền thuộc <b>NHÓM 4 - TH27.09</b></p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}