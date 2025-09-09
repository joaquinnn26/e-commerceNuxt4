import cloudinary from '../../utils/cloudinaryConfig.js'
import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { image } = body

  if (!image) throw createError({ statusCode: 400, statusMessage: 'No hay imagen para subir' })

  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'productos'
    })

    return { url: uploadResponse.secure_url }
  } catch (err) {
    throw createError({ statusCode: 500, statusMessage: 'Error al subir imagen' })
  }
})
