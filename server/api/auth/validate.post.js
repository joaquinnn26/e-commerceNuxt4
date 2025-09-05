import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body.token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { role: decoded.role }
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido o expirado' })
  }
})