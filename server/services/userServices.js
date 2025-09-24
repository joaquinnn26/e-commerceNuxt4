import Cart from '../models/cart.js'
import User from '../models/Users.js'
import { connectDB } from '../utils/db.js'
import bcrypt from 'bcryptjs'

async function getUsers() {
    await connectDB()
  return await User.find()
}
async function getUserByEmail(email) {
    await connectDB()
    return await User.findOne({email})
}
async function createUser(userData) {
    await connectDB()
    const {email, password, name, telefono} = userData  

    if(!email || !password || !name || !telefono) {
    throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' })
}
    const existingUser = await User.findOne({email})

    if(existingUser) {
        throw createError({ statusCode: 409, statusMessage: 'El email ya está registrado' })
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser =await User.create({ email, passwordHash, name ,telefono})
    await Cart.create({ userId: newUser._id, items: [] });
    return {
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
    telefono: newUser.telefono
  }

}

async function updateUser(id, userData) {
      await connectDB()

  const allowedFields = ['email', 'name', 'password']
  const updateData = {}

  for (const field of allowedFields) {
    if (userData[field]) {
      updateData[field] = userData[field]
    }
  }

  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10)
    delete updateData.password
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-passwordHash')

  if (!updatedUser) {
    throw createError({ statusCode: 404, statusMessage: 'Usuario no encontrado' })
  }

  return updatedUser
}   
async function deleteUser(id) {
    await connectDB()
    const deletedUser = await User.findByIdAndDelete(id)    
    return deletedUser
}   
export {
    getUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
}