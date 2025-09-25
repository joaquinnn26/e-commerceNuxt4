
import mongoose from "mongoose";
import Order from "../../models/order.js";
import Product from "../../models/products.js";
import { createOrder } from "../../services/ordersServices.js";

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

    // Construir snapshot de items con nombre y precio actuales
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "La orden debe incluir items" });
    }

    const productIds = body.items.map(i => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } }, { nombre: 1, precio: 1 });
    const idToProd = new Map(dbProducts.map(p => [p._id.toString(), p]));

    body.items = body.items.map(i => {
      const p = idToProd.get(String(i.productId));
      return {
        productId: new mongoose.Types.ObjectId(i.productId),
        quantity: Number(i.quantity) || 1,
        productName: p ? p.nombre : 'Producto eliminado',
        productPrice: p ? p.precio : 0,
      };
    });

    // Crear orden
    const newOrder = await createOrder(body);

    // Devolver la orden con productos y usuario populados
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "name email telefono"); // incluir telefono

    return populatedOrder;

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error al crear la orden",
      data: error.message,
    });
  }
});