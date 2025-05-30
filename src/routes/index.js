import LayoutAdmin from "../layout/LayoutAdmin";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserInfo from "../pages/UserInfo";
import GetTicket from "../pages/GetTicket";
import AboutUs from "../pages/AboutUs";
import AdminInfo from "../pages/Admin/AdminInfo";
import BookingsManagement from "../pages/Admin/BookingsManagement";
import Purchase from "../pages/Purchase";
import History from "../pages/History";
import FlightsManagement from "../pages/Admin/FlightsManagement";
import PlanesManagement from "../pages/Admin/PlanesManagement";
import AirlinesManagement from "../pages/Admin/AirlinesManagement";
// import CheckOut from "../pages/CheckOut";

export const routes = [
    {
        path: '/',
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'user-info',
                element: <UserInfo />
            },
            {
                path: 'get-ticket',
                element: <GetTicket />
            },
            {
                path: 'about-us',
                element: <AboutUs />
            },
            {
                path: 'purchase',
                element: <Purchase />
            },
            {
                path: 'user-history',
                element: <History />
            }
        ]
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'register',
        element: <Register />
    },
    {
        path: 'admin',
        element: <LayoutAdmin />,
        children: [
            {
                index: true,
                element: <AdminInfo />
            },
            {
                path: 'bookings',
                element: <BookingsManagement />
            },
            {
                path: 'flights',
                element: <FlightsManagement />
            },
            {
                path: 'planes',
                element: <PlanesManagement />
            },
            {
                path: 'airlines',
                element: <AirlinesManagement />
            }
        ]
    }
]