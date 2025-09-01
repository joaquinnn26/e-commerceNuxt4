
// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN_TEST });


export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const cartItems = body.cart || []

  if (!cartItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'Carrito vacío' })
  }

  // Mapea el carrito al formato del SDK
  const items = cartItems.map(item => ({
    title: item.productId.nombre,
    quantity: item.quantity,
    unit_price: Number(item.productId.precio)
  }))

  try {
    const preference = new Preference(client)
    const response = await preference.create({
      body: {
        items,
        back_urls: {
          success: 'http://localhost:3000/payment/success',
          failure: 'http://localhost:3000/payment/failure',
          pending: 'http://localhost:3000/payment/pending'
        },
        auto_return: 'approved'
      }
    })

    return { init_point: response.body.init_point }
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: err.message })
  }

    /* const mockInitPoint = 'http://localhost:3000/payment/success'

  console.log('Checkout mock items:', items)

  return { init_point: mockInitPoint } */
})