import './LayoutDefault.scss';
import { NavLink, Outlet } from 'react-router';
import Logo from '../../image/logoFT.png';
import '../../styles/styles.scss';
import Button from '@mui/material/Button';

export default function LayoutDefault() {
    const token = '';
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
                                    <NavLink to='/'>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/'>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/'>Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to='/'>Home</NavLink>
                                </li>
                            </ul>
                        </nav>
                        <div className="header__untils">
                            {token ? <>
                                <div className="header__untils__cart-user">

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