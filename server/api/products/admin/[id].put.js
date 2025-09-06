
import { updateProduct } from "~~/server/services/productsServices";

export default defineEventHandler(async (event) => {
    try {
        const { id } = event.context.params;
    if (!id || id.length !== 24) {
        throw createError({ statusCode: 400, statusMessage: 'ID inválido' });
    }
    const body = await readBody(event);
    const updatedProduct = await updateProduct(id, body);
    return updatedProduct;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el producto', data: error.message });
    }

});
