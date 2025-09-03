import { getOrdersByStatus } from "~~/server/services/ordersServices.js";

export default defineEventHandler(async (event) => {        
    try {
        const { status } = event.context.params;
        if (!status) {
            throw createError({ statusCode: 400, statusMessage: 'Estado es requerido' });
        }   
        const orders = await getOrdersByStatus(status);
        return orders;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al obtener las órdenes por estado', data: error.message });
    }
});

