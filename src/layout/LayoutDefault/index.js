import './LayoutDefault.scss';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../../image/logoFT.png';
import '../../styles/styles.scss';
import Button from '@mui/material/Button';
import { Avatar, Menu, MenuItem, Paper } from '@mui/material';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function LayoutDefault() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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
    const token = 'ntuananh1124';
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
                                    <NavLink to='/'>
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
                                    <NavLink to='/'>Về chúng tôi</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/'>Liên hệ</NavLink>
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
                                                <Link to='/user-info'>Profile</Link>
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>My Flights</MenuItem>
                                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </> : <>
                                <div className="header__untils__login-regis">
                                    <Button color='primary'>
                                        <NavLink to='/login' color='primary'>ĐĂNG NHẬP</NavLink>
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
                <footer></footer>
            </div>
        </>
    )
}