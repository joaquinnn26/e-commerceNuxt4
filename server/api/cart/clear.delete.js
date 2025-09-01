import { clearCart } from "~~/server/services/cartServices.js";

export default defineEventHandler(async (event) => {
  const { userId } = await readBody(event);
  return await clearCart(userId);
}); 