import { verifyToken } from '../utils/jwt.js'

export default defineEventHandler((event) => {
  // Solo rutas admin
  if (!event.path.startsWith('/api/products/admin')) return

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) throw createError({ statusCode: 401, statusMessage: 'Token requerido' })

  const token = authHeader.split(' ')[1]
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Formato de token inválido' })

  try {
    const decoded = verifyToken(token)
    event.context.auth = decoded
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido o expirado' })
  }
})