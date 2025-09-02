import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true, },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  imagen: { type: String },
  categoria: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)