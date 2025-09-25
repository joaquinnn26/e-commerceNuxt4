import order from "../models/order.js";
import User from "../models/Users.js";
import { connectDB } from '../utils/db.js';


export const createOrder = async (orderData) => {
  await connectDB();
  const newOrder = new order(orderData);
  return await newOrder.save();
}   

export const getOrdersByUserName = async (userName) => {
    await connectDB();
  return await order.find({ userName }).populate('items.productId');
}       
export const getAllOrders = async (page = 1, limit = 8, search = '') => {
    await connectDB();
    const skip = (page - 1) * limit;
    
    let orders, total;
    
    // Si hay búsqueda, usar agregación optimizada
    if (search && search.trim()) {
        try {
            const searchTerm = search.trim();
            
            // Usar agregación para búsqueda más eficiente
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.productId',
                        foreignField: '_id',
                        as: 'products'
                    }
                },
                {
                    $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
                },
                {
                    $match: {
                        $or: [
                            { _id: { $regex: searchTerm, $options: 'i' } },
                            { 'user.name': { $regex: searchTerm, $options: 'i' } },
                            { 'user.email': { $regex: searchTerm, $options: 'i' } },
                            { 'user.telefono': { $regex: searchTerm, $options: 'i' } }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $facet: {
                        data: [
                            { $skip: skip },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: 1,
                                    userId: 1,
                                    items: 1,
                                    total: 1,
                                    estado: 1,
                                    createdAt: 1,
                                    'user.name': 1,
                                    'user.email': 1,
                                    'user.telefono': 1,
                                    'products.nombre': 1,
                                    'products.precio': 1
                                }
                            }
                        ],
                        count: [{ $count: 'total' }]
                    }
                }
            ];
            
            const result = await order.aggregate(pipeline);
            orders = result[0].data;
            total = result[0].count[0]?.total || 0;
            
            // Asegurar que todos los usuarios tengan teléfono
            orders = orders.map(orderDoc => {
                if (orderDoc.user && (!orderDoc.user.telefono || orderDoc.user.telefono === '')) {
                    orderDoc.user.telefono = '000-000-0000';
                }
                return {
                    ...orderDoc,
                    userId: orderDoc.user,
                    items: orderDoc.items.map(item => ({
                        ...item,
                        productId: orderDoc.products.find(p => p._id.toString() === item.productId.toString()) || item.productId
                    }))
                };
            });
            
        } catch (error) {
            // Fallback a consulta simple
            orders = await order.find()
              .populate('userId', 'name email telefono')
              .populate('items.productId', 'nombre precio')
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(limit);
            
            total = await order.countDocuments();
            
            // Asegurar que todos los usuarios tengan teléfono
            orders = orders.map(orderDoc => {
                if (orderDoc.userId && (!orderDoc.userId.telefono || orderDoc.userId.telefono === '')) {
                    orderDoc.userId.telefono = '000-000-0000';
                }
                return orderDoc;
            });
        }
        
    } else {
        // Sin búsqueda, usar consulta optimizada con select específico
        orders = await order.find()
          .populate('userId', 'name email telefono')
          .populate('items.productId', 'nombre precio')
          .select('_id userId items total estado createdAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        
        // Asegurar que todos los usuarios tengan teléfono
        orders = orders.map(orderDoc => {
            if (orderDoc.userId && (!orderDoc.userId.telefono || orderDoc.userId.telefono === '')) {
                orderDoc.userId.telefono = '000-000-0000';
            }
            return orderDoc;
        });
        
        total = await order.countDocuments();
    }
    
    const totalPages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
}

export const updateOrderStatus = async (orderId, status) => {
    await connectDB();
  return await order.findByIdAndUpdate(orderId, { estado: status }, { new: true });
}

export const getOrderById = async (orderId) => {
    await connectDB();
  return await order.findById(orderId).populate('items.productId').populate('userId', 'name email telefono');
}   
export const deleteOrder = async (orderId) => {
    await connectDB();
  return await order.findByIdAndDelete(orderId);
}   
export const getOrdersByStatus = async (status) => {
    await connectDB();
    const orders = await order.find({ estado: status }).populate('items.productId').populate('userId', 'name email telefono');
    
    // Asegurar que todos los usuarios tengan teléfono
    for (let orderDoc of orders) {
        if (orderDoc.userId && (!orderDoc.userId.telefono || orderDoc.userId.telefono === '')) {
            orderDoc.userId.telefono = '000-000-0000';
        }
    }
    
    return orders;
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
  }).populate('items.productId').populate('userId', 'name email telefono');
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




