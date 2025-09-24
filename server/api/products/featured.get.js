import Product from '../../models/products.js'

export default defineEventHandler(async (event) => {
  try {
    // Obtener productos destacados
    const featuredProducts = await Product.find({ destacado: true })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
      .limit(12) // Limitar a 12 productos destacados

    return featuredProducts
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})
