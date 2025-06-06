import axios from 'axios';
import { get } from '../helpers/request.js';
import { hosting } from "./host";

export const getAirportList = async () => {
    const res = await get(`Airports`);
    return res; 
}

export const getAirportByIdAxios = async (id) => {
    try {
        const res = await axios.get(`${hosting}/airports/${id}`);
        if (res && res.data) {
            // debugger
            return res.data;
        };
    } catch(err) {
        console.log('error airports!');
    }
}

export const getAirportListAxios = async () => {
    try {
        const res = await axios.get(`${hosting}/airports`);
        if (res && res.data) {
            // debugger
            return res.data;
        };
    } catch(err) {
        console.log('error airports!');
    }
}