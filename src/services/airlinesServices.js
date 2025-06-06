import { get } from '../helpers/request.js';
import axios from 'axios';
import { hosting } from './host.js';

export const getAirlinesList = async () => {
    const res = await get(`Airlines`);
    return res;
};

export const getAirlines = async (id) => {
    const res = await get(`Airlines/${id}`);
    return res;
}

export const getAirlinesAxios = async () => {
    try {
        const res = await axios.get(`${hosting}/airlines`);
        if (res && res.data) {
            // debugger
            return res.data;
        };
    } catch (error) {
        console.log('error airlines!');
    }
}