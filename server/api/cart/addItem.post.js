import { addItemToCart } from '../../services/cartServices.js';
import Product from '../../models/products.js'
export default defineEventHandler(async (event) => {
  const { userId, productId, quantity } = await readBody(event);
  // Validar stock antes de agregar
  const prod = await Product.findById(productId, { stock: 1 });
  if (!prod) {
    throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' })
  }
  if (prod.stock <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Sin stock' })
  }
  return await addItemToCart(userId, productId, quantity);
});