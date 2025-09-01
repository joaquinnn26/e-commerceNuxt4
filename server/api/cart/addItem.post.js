import { addItemToCart } from '~~/server/services/cartServices.js';
export default defineEventHandler(async (event) => {
  const { userId, productId, quantity } = await readBody(event);
  return await addItemToCart(userId, productId, quantity);
});