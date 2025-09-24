import jwt from 'jsonwebtoken'
import {connectDB} from '../../utils/db.js'
import User from '../../models/Users.js'

export default defineEventHandler(async (event) => {
  await connectDB()
  const config = useRuntimeConfig()

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({ statusCode: 401, statusMessage: 'Token no enviado' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    return { user }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
  }
})