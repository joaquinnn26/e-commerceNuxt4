import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userName: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  estado: { type: String, enum: ['pendiente', 'confirmado', 'rechazado'], default: 'pending' },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);