import { getAllOrders } from "../../services/ordersServices.js";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 8;
        const search = query.search || '';
        
        const result = await getAllOrders(page, limit, search);
        return result;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al obtener las órdenes', data: error.message });
    }   
});
