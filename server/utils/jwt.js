import jwt from 'jsonwebtoken'

export function signToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }

  const config = useRuntimeConfig()

  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.JWT_SECRET)
}