export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/products/admin')) return

  const user = event.context.auth 
  if (!user) throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  if (user.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'No tienes permisos de administrador' })
})