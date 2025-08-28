import { createUser } from '~~/server/services/userServices.js'

export default defineEventHandler(async (event) => {

  try {
    const body = await readBody(event)

  const newUser = await createUser(body)

  return {
    message: 'Usuario creado correctamente',
    user: newUser
  }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error al crear el usuario', data: error.message })
  }
  
})