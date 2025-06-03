import { get } from "../helpers/request";

export const getRoutes = async () => {
    const res = await get(`Routes`);
    return res;
}