import { getUserByEmail } from '../../services/userServices.js'
import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const user = await getUserByEmail(email)
  if (!user) throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) throw createError({ statusCode: 401, statusMessage: 'Contraseña incorrecta' })

  const token = signToken(user)

  return {
    id: user._id,
    message: 'Login exitoso',
    token,
    role: user.role,
  }
})