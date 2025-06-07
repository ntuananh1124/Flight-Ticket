import { hosting } from "./host";
import axios from "axios";

export const checkAdminAxios = async (username, password) => {
    try {
        const res = await axios.get(`${hosting}/admins/check?username=${username}&password=${password}`);
        if (res && res.data) return res.data;
    } catch (err) {
        console.log('check admin co loi');
    }
}