import { hosting } from "./host";
import axios from "axios";

export const getAirplanesAxios = async () => {
    try {
        const res = await axios.get(`${hosting}/airplanes`);
        if (res && res.data) {
            // debugger
            return res.data;
        };
    } catch (error) {
        console.log('error airlines!');
    }
}