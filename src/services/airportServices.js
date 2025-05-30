import { get } from '../helpers/request.js';

export const getAirportList = async () => {
    const res = await get(`Airports`);
    return res; 
}