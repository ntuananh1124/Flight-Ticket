import { useState } from 'react';
import { Drawer, List, ListItem, IconButton, Toolbar, AppBar, Typography, Button, Avatar, MenuItem, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Sidebar.scss';
import { NavLink, useNavigate } from 'react-router';
import { deleteCookie, getCookie } from '../../helpers/cookie';
// import { redirect } from "react-router";

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openAnchor = Boolean(anchorEl);
    const navigate = useNavigate();

    const admin_name = getCookie('admin_name');
    const admin_role = getCookie('admin_role');

    const handleClick = (event) => {
        // console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const list = (
        <div
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
            style={{ width: 250 }}
        >
            <List>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='/admin'>Hồ sơ</NavLink>
                </ListItem>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='flights'>Quản lí chuyến bay</NavLink>
                </ListItem>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='bookings'>Bookings</NavLink>
                </ListItem>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='users'>Quản lí người dùng</NavLink>
                </ListItem>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='planes'>Máy bay</NavLink>
                </ListItem>
                <ListItem button>
                    <NavLink style={{width: '100%'}} to='airlines'>Hãng hàng không</NavLink>
                </ListItem>
            </List>
        </div>
    );

    const handleLogOut = () => {
        console.log('logged out');
        deleteCookie('admin_id');
        deleteCookie('admin_name');
        deleteCookie('admin_role');
        deleteCookie('admin_token');
        navigate('/login');
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

    return (
        <Toolbar>
            <AppBar position="fixed">
                <Toolbar className='custom-toolbar'>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        aria-label="menu" 
                        onClick={toggleDrawer} 
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        FLIGHT TICKET ADMIN SITE
                    </Typography>
                    <div className="admin">
                        <div className="admin__info" onClick={handleClick}>
                            <Avatar className='avatar-custom' {...stringAvatar('Admin 12')} />
                            <span className='admin__info__name'>{admin_name}</span>
                        </div>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openAnchor}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>
                                <span>Chức vụ: {admin_role}</span>
                            </MenuItem>
                        </Menu>
                        <Button color='primary' variant="outlined" style={{color: 'white'}} onClick={handleLogOut}>
                            ĐĂNG XUẤT
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
            >
                {list}
            </Drawer>
        </Toolbar>
    );
}
