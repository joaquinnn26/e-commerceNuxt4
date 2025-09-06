import { createProduct } from "~~/server/services/productsServices";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try {
    const newProduct = await createProduct(body);
    return newProduct;
    } catch (error) {

        throw createError({ statusCode: 500, statusMessage: 'Error al crear el producto en api', data: error.message });
    }

});