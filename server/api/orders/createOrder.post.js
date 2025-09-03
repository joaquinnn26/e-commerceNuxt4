
import mongoose from "mongoose";
import Order from "~~/server/models/order.js";
import { createOrder } from "~~/server/services/ordersServices.js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validaciones básicas
    if (!body.userId) {
      throw createError({ statusCode: 400, statusMessage: "Falta el ID de usuario" });
    }
    if (!mongoose.Types.ObjectId.isValid(body.userId)) {
      throw createError({ statusCode: 400, statusMessage: "userId inválido" });
    }

    // Convertir a ObjectId para mongoose
    body.userId = new mongoose.Types.ObjectId(body.userId);

    // Crear orden
    const newOrder = await createOrder(body);

    // Devolver la orden con productos y usuario populados
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "nombre email")           // trae info del usuario
      .populate("items.productId", "nombre precio"); // trae info del producto

    return populatedOrder;

  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error al crear la orden",
      data: error.message,
    });
  }
});