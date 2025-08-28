import {connectDB} from '~~/server/utils/db.js'

export default defineEventHandler(async () => {
  try {
    await connectDB()
    return { ok: true, message: 'MongoDB conectado' }
  } catch (e) {
    return { ok: false, message: e.message }
  }
})