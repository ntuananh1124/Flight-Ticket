import { Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";

export default function LayoutAdmin() {
    return (
        <>
            <Sidebar />
            <Outlet/>
        </>
    )
}