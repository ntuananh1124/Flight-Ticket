import axios from 'axios';
import { get } from '../helpers/request.js';
import { hosting } from './host.js';

export const getFlights = async () => {
    const res = await get(`Flights`);
    return res;
}

export const getFlightPrices = async () => {
    const res = await get(`FlightPrices`);
    return res;
}

export const getFlightsAxios = async () => {
    try {
        const res = await axios.get(`${hosting}/flights`);
        if (res && res.data) return res.data;
    } catch (err) {
        console.log('flights err');
    }
}