import { getProductById } from "~~/server/services/productsServices";


export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;
    if (!id || id.length !== 24) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID inválido'
      });
    }

    return await getProductById(id);
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error interno del servidor'
    });
  }
});