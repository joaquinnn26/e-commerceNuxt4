import { getAllOrders } from "../../services/ordersServices.js";

export default defineEventHandler(async (event) => {
    try {
        const orders = await getAllOrders();
        return orders;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al obtener las órdenes', data: error.message });
    }   
});
