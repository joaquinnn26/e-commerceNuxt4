import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return
  try {
    const config = useRuntimeConfig()
    await mongoose.connect(config.MONGO_URI)
    isConnected = true
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err)
    throw err
  }
}