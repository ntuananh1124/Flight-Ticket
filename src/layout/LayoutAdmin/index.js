import { Outlet, useNavigate } from "react-router";
import Sidebar from "../../components/Sidebar";

export default function LayoutAdmin() {
    const token = 'abc';
    const navigate = useNavigate();
    
    if (token === '') {
        navigate('/login');
    } else console.log(token);

    return (
        <>
            <Sidebar />
            <Outlet/>
        </>
    )
}