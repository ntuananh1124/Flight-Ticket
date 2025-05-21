import { get } from '../helpers/request.js';

export const getUser = async (userId) => {
    const res = await get(`/Users/${userId}`);
    return res;
};