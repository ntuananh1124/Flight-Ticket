import LayoutAdmin from "../layout/LayoutAdmin";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserInfo from "../pages/UserInfo";

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
            }
        ]
    },
    {
        path: 'admin',
        element: <LayoutAdmin />
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'register',
        element: <Register />
    }
]