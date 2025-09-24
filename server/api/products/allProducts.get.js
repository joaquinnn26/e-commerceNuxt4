import { getProducts } from "../../services/productsServices";

export default defineEventHandler(async (event) => {
    try {
            const products = await getProducts();
    if (!products) {
        throw createError({ statusCode: 404, statusMessage: 'Productos no encontrados' });
    }
    return products;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al obtener los productos', data: error.message });
    }

});