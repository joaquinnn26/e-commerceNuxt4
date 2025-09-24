import { createUser } from "../../services/userServices.js";

export default defineEventHandler(async (event) => {
    try {
    const body = await readBody(event)

    if (!body.email || !body.password || !body.name) {
      throw createError({ statusCode: 400, statusMessage: 'Email, password y name son requeridos' })
    }

    const newUser = await createUser(body)

    return {
      message: 'Usuario creado correctamente',
      user: newUser
    }
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error interno del servidor'
    })
  }
})