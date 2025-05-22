import { get } from '../helpers/request.js';

export const getAirlinesList = async () => {
    const res = await get(`Airlines`);
    return res;
};