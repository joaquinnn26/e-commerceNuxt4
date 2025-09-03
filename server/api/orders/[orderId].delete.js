import { deleteOrder } from "~~/server/services/ordersServices.js";

export default defineEventHandler(async (event) => {
  const { orderId } = event.context.params;

  try {
    const deleted = await deleteOrder(orderId);
    if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: "Orden no encontrada" });
    }
    return { message: "Orden borrada correctamente" };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});