import jwt from 'jsonwebtoken'

export function signToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name
  }

  // useRuntimeConfig() para leer el secreto desde runtime
  const config = useRuntimeConfig()

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' })
}

export function verifyToken(token) {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.JWT_SECRET)
}