import mongoose from "mongoose";

const cartSchemas = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,ref: "User", required: true }, 
    items: [
        {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        },
    ],
    createdAt: { type: Date, default: Date.now }
},{ timestamps: true });
export default mongoose.models.Cart || mongoose.model('Cart', cartSchemas);