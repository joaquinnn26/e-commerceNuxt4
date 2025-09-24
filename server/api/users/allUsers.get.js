import { getUsers } from '../../services/userServices.js'

export default defineEventHandler(async () => {
  try {
    const users = await getUsers()
    return users
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Error interno del servidor'
    })
  }
})