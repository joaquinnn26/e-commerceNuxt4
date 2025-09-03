import { updateOrderStatus } from "~~/server/services/ordersServices.js";

export default defineEventHandler(async (event) => {
  const { orderId } = event.context.params;

  try {
    const updated = await updateOrderStatus(orderId, "confirmado");
    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: "Orden no encontrada" });
    }
    return { message: "Orden confirmada correctamente", order: updated };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});