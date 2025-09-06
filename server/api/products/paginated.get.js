import { getPaginatedProducts } from "../../services/productsServices.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 8;
  const category = query.category || null;
  const search = query.search || '';

  return await getPaginatedProducts(page, limit, category, search);
});