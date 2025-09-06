import { deleteProduct } from "~~/server/services/productsServices";

export default defineEventHandler(async (event) => {

    try {
            const { id } = event.context.params;
    if (!id || id.length !== 24) {
        throw createError({ statusCode: 400, statusMessage: 'ID inválido' });
    }
    const result = await deleteProduct(id);
    return result;
    } catch (error) {
        throw createError({ statusCode: 500, statusMessage: 'Error al eliminar el producto', data: error.message });
    }

});