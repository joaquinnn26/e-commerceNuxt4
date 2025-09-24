import { connectDB } from '../utils/db.js'
import Cart from '../models/cart.js'



async function getCartByUserId(userId) {
    await connectDB();

    if (!userId) {
        throw new Error("No se recibió un userId válido");
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
        cart = new Cart({ userId, items: [] });
        await cart.save();
    }

    return cart;
}
async function createCart(userId) {
    await connectDB();
    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
        throw createError({ statusCode: 400, statusMessage: 'El usuario ya tiene un carrito' });
    }  
    const newCart = await Cart.create({ userId, items: [] });
    return newCart; }

async function addItemToCart(userId, productId, quantity) {
    await connectDB();
    const cart = await Cart.findOne({ userId });
    if (!cart) {    
        throw createError({ statusCode: 404, statusMessage: 'Carrito no encontrado' });
    }   
    const delta = Number.isFinite(Number(quantity)) ? Number(quantity) : 0;
    if (delta === 0) {
        return cart; // no changes for zero deltas
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
        const nextQty = (cart.items[existingItemIndex].quantity || 0) + delta;
        if (nextQty <= 0) {
            // Remove the item if quantity would be zero or negative
            cart.items.splice(existingItemIndex, 1);
        } else {
            cart.items[existingItemIndex].quantity = nextQty;
        }
    } else if (delta > 0) {
        // Only add new item if positive quantity
        cart.items.push({ productId, quantity: delta });
    }
    await cart.save();
    return cart;
}

async function removeItemFromCart(userId, productId) {
    await connectDB();
    const cart = await Cart.findOne({ userId });
    if (!cart) {    
        throw createError({ statusCode: 404, statusMessage: 'Carrito no encontrado' });
    }   
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();  }

async function clearCart(userId) {
    await connectDB();
    const cart = await Cart.findOne({ userId });
    if (!cart) {    
        throw createError({ statusCode: 404, statusMessage: 'Carrito no encontrado' });
    }   
    cart.items = [];
    await cart.save();  }       

    export {
    getCartByUserId,
    createCart,
    addItemToCart,
    removeItemFromCart,
    clearCart

    }