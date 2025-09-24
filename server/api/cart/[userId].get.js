import { getCartByUserId } from '../../services/cartServices.js';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.params;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "El parámetro userId es obligatorio"
    });
  }

  return await getCartByUserId(userId);
});