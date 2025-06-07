import axios from 'axios';
import { get } from '../helpers/request.js';
import { hosting } from './host.js';

export const getUser = async (userId) => {
    const res = await get(`/Users/${userId}`);
    return res;
};

export const checkUserAxios = async (email, password) => {
    try {
        const res = await axios.get(`${hosting}/users/check?email=${email}&password=${password}`);
        if (res && res.data) return res.data;
    } catch (err) {
        console.log('check user co loi');
    }
}

export const getUserByIdAxios = async (userId) => {
    try {
        const res = await axios.get(`${hosting}/users/${userId}`);
        if (res && res.data) return res.data;
    } catch (err) {
        console.log('Loi get user info');
    }
}