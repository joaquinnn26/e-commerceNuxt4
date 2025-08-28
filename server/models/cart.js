import mongoose from "mongoose";

const cartSchemas = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,ref: "Users", required: true }, 
    items: [
        {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        },
    ],
    createdAt: new Date(),
    updatedAt: new Date()
},{ timestamps: true });
export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchemas);