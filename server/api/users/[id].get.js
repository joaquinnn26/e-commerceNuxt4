import { getUserByEmail } from "~~/server/services/userServices.js";

export default defineEventHandler(async (event) => {
  const { email } = event.context.params;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' });
    }
    return user;
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error interno del servidor'
    });
  }
})

