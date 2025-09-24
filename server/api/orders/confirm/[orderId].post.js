import { updateOrderStatus, getOrderById } from "../../../services/ordersServices.js";
import Product from "../../../models/products.js";

export default defineEventHandler(async (event) => {
  const { orderId } = event.context.params;

  try {
    // Traer orden para descontar stock
    const order = await getOrderById(orderId);
    if (!order) {
      throw createError({ statusCode: 404, statusMessage: "Orden no encontrada" });
    }

    // Descontar stock de cada item
    for (const item of order.items) {
      if (item.productId) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    const updated = await updateOrderStatus(orderId, "confirmado");
    if (!updated) {
      throw createError({ statusCode: 404, statusMessage: "Orden no encontrada" });
    }
    return { message: "Orden confirmada correctamente", order: updated };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});