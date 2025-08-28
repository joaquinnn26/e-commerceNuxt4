import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return
console.log('🔌 Conectando a MongoDB...')
  try {
    const config = useRuntimeConfig()
    await mongoose.connect(config.MONGO_URI)
    isConnected = true
    console.log('✅ Conectado a MongoDB')
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err)
    throw err
  }
}