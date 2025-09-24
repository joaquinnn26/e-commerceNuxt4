import { removeItemFromCart } from "../../services/cartServices.js";


export default defineEventHandler(async (event) => {
  const { userId, productId } = await readBody(event);
  return await removeItemFromCart(userId, productId);
});