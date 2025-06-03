import { get } from '../helpers/request.js';

export const getFlights = async () => {
    const res = await get(`Flights`);
    return res;
}

export const getFlightPrices = async () => {
    const res = await get(`FlightPrices`);
    return res;
}