import { get } from "../helpers/request";
import axios from "axios";
import { hosting } from "./host";

export const getRoutes = async () => {
    const res = await get(`Routes`);
    return res;
}

export const getRoutesAxios = async () => {
    try {
        const res = await axios.get(`${hosting}/routes`);
        if (res && res.data) {
            // debugger
            return res.data;
        };
    } catch (error) {
        console.log('error routes!');
    }
}