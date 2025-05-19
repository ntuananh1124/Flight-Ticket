import LayoutAdmin from "../layout/LayoutAdmin";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";

export const routes = [
    {
        path: '/',
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            },
        ]
    },
    {
        path: 'admin',
        element: <LayoutAdmin />
    },
    {
        path: 'login',
        element: <Login />
    }
]