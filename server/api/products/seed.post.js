import Product from '../../models/products.js'
import { connectDB } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== 'POST') {
      throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
    }

    await connectDB()

    const baseProducts = [
      {
        nombre: 'Auriculares Bluetooth Pro',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido y 24h de batería.',
        precio: 24999,
        stock: 35,
        imagen: 'https://picsum.photos/seed/auriculares/800/600',
        categoria: 'electronica',
        destacado: true,
      },
      {
        nombre: 'Smartwatch Deportivo X',
        descripcion: 'Reloj inteligente con GPS, monitor de ritmo cardíaco y resistencia al agua.',
        precio: 39999,
        stock: 20,
        imagen: 'https://picsum.photos/seed/smartwatch/800/600',
        categoria: 'electronica',
        destacado: true,
      },
      {
        nombre: 'Zapatillas Urban Comfort',
        descripcion: 'Zapatillas cómodas y livianas para uso diario con suela antideslizante.',
        precio: 19999,
        stock: 50,
        imagen: 'https://picsum.photos/seed/zapatillas/800/600',
        categoria: 'ropa',
        destacado: true,
      },
      {
        nombre: 'Campera Rompeviento Premium',
        descripcion: 'Campera impermeable y respirable ideal para actividades al aire libre.',
        precio: 34999,
        stock: 18,
        imagen: 'https://picsum.photos/seed/campera/800/600',
        categoria: 'ropa',
        destacado: false,
      },
      {
        nombre: 'Cafetera Automática Barista',
        descripcion: 'Cafetera con molinillo integrado y espumador de leche para café perfecto.',
        precio: 89999,
        stock: 10,
        imagen: 'https://picsum.photos/seed/cafetera/800/600',
        categoria: 'hogar',
        destacado: true,
      },
      {
        nombre: 'Set de Sábanas Microfibra',
        descripcion: 'Juego de sábanas suaves y frescas para cama de 2 plazas.',
        precio: 14999,
        stock: 40,
        imagen: 'https://picsum.photos/seed/sabanas/800/600',
        categoria: 'hogar',
        destacado: false,
      },
      {
        nombre: 'Lámpara LED de Escritorio',
        descripcion: 'Luz LED regulable con brazo flexible y carga USB integrada.',
        precio: 8999,
        stock: 60,
        imagen: 'https://picsum.photos/seed/lampara/800/600',
        categoria: 'hogar',
        destacado: true,
      },
      {
        nombre: 'Mochila Antirrobo Traveler',
        descripcion: 'Mochila con cierre oculto, puerto USB y material impermeable.',
        precio: 17999,
        stock: 25,
        imagen: 'https://picsum.photos/seed/mochila/800/600',
        categoria: 'hogar',
        destacado: false,
      },
      {
        nombre: 'Parlante Bluetooth 360º',
        descripcion: 'Sonido envolvente 360°, resistente al agua, 12h de autonomía.',
        precio: 22999,
        stock: 32,
        imagen: 'https://picsum.photos/seed/parlante/800/600',
        categoria: 'electronica',
        destacado: true,
      },
      {
        nombre: 'Remera Oversize Unisex',
        descripcion: 'Remera de algodón premium oversize, ideal para uso urbano.',
        precio: 7999,
        stock: 70,
        imagen: 'https://picsum.photos/seed/remera/800/600',
        categoria: 'ropa',
        destacado: false,
      },
    ]

    // Opcional: evitar duplicados por nombre
    const names = baseProducts.map(p => p.nombre)
    await Product.deleteMany({ nombre: { $in: names } })

    const inserted = await Product.insertMany(baseProducts)

    return {
      ok: true,
      created: inserted.length,
      products: inserted,
    }
  } catch (error) {
    console.error('Error al sembrar productos:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error al sembrar productos' })
  }
})


