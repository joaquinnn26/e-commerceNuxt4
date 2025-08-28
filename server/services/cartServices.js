import { connectDB } from '~~/server/utils/db.js'
import Cart from '~~/server/models/cart.js'


async function getCartByUserId(userId) {
    await connectDB();
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
        throw createError({ statusCode: 404, statusMessage: 'Carrito no encontrado' });
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
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
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