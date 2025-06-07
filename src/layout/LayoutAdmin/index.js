import { Outlet, useNavigate } from "react-router";
import Sidebar from "../../components/Sidebar";
import { getCookie } from "../../helpers/cookie";
import { useEffect } from "react";

export default function LayoutAdmin() {
    const navigate = useNavigate();
    const admin_token = getCookie('admin_token');

    useEffect(() => {
        if (!admin_token) {
            navigate('/login', { replace: true });
        }
    }, [admin_token, navigate]);

    if (!admin_token) {
        return null; // không render Layout khi đang redirect
    }

    return (
        <>
            <Sidebar />
            <Outlet />
        </>
    );
}