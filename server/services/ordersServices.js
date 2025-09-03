import order from "../models/order.js";
import { connectDB } from '~~/server/utils/db.js';


export const createOrder = async (orderData) => {
  await connectDB();
  const newOrder = new order(orderData);
  return await newOrder.save();
}   

export const getOrdersByUserName = async (userName) => {
    await connectDB();
  return await order.find({ userName }).populate('items.productId');
}       
export const getAllOrders = async () => {
    await connectDB();
  return await order.find().populate('items.productId').populate('userId');
}

export const updateOrderStatus = async (orderId, status) => {
    await connectDB();
  return await order.findByIdAndUpdate(orderId, { estado: status }, { new: true });
}

export const getOrderById = async (orderId) => {
    await connectDB();
  return await order.findById(orderId).populate('items.productId').populate('userId');
}   
export const deleteOrder = async (orderId) => {
    await connectDB();
  return await order.findByIdAndDelete(orderId);
}   
export const getOrdersByStatus = async (status) => {
    await connectDB();
  return await order.find({ estado: status }).populate('items.productId').populate('userId');
}   
export const getOrderStats = async () => {
    await connectDB();
  const totalOrders = await order.countDocuments();
  const totalRevenue = await order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  return {
    totalOrders,
    totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0
  };
}       
export const getOrdersByDateRange = async (startDate, endDate) => {
    await connectDB();
  return await order.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
  }).populate('items.productId').populate('userId');
}       

export const getTopSellingProducts = async (limit = 5) => {
    await connectDB();
  return await order.aggregate([
    { $unwind: "$items" }, 
    { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },      
    { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
    { $unwind: "$product" },
    { $project: { _id: 0, productId: "$_id", productName: "$product.name", totalSold: 1 } } 
    ]); 
}




