import { connectDB } from '../utils/db.js';
import Product from '../models/products.js';
 


async function getProducts() {
  await connectDB();
  return await Product.find();
}

async function getProductById(id) {
  await connectDB();
  const product = await Product.findById(id);
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' });
  } 
  return product;
}
export const getPaginatedProducts = async (page = 1, limit = 8, category = null, search = '') => {
  await connectDB();

  let products, total;

  // Si hay búsqueda, usar filtrado en memoria
  if (search && search.trim()) {
    try {
      // Cargar todos los productos
      const allProducts = await Product.find()
        .sort({ createdAt: -1 }); // Más recientes primero
      
      // Filtrar en memoria por el término de búsqueda
      const searchTerm = search.trim().toLowerCase();
      let filteredProducts = allProducts.filter(product => {
        // Buscar en nombre del producto
        if (product.nombre && product.nombre.toLowerCase().includes(searchTerm)) {
          return true;
        }
        // Buscar en descripción del producto
        if (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm)) {
          return true;
        }
        // Buscar en categoría del producto
        if (product.categoria && product.categoria.toLowerCase().includes(searchTerm)) {
          return true;
        }
        return false;
      });
      
      // Aplicar filtro de categoría si existe
      if (category) {
        filteredProducts = filteredProducts.filter(product => 
          product.categoria && product.categoria.toLowerCase() === category.toLowerCase()
        );
      }
      
      
      // Aplicar paginación
      total = filteredProducts.length;
      const skip = (page - 1) * limit;
      products = filteredProducts.slice(skip, skip + limit);
      
    } catch (error) {
      // Fallback a sin búsqueda
      const filter = category ? { categoria: category } : {};
      products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      
      total = await Product.countDocuments(filter);
    }
    
  } else {
    // Sin búsqueda, usar consulta normal con filtro de categoría
    const filter = category ? { categoria: category } : {};
    
    products = await Product.find(filter)
      .sort({ createdAt: -1 }) // Más recientes primero
      .skip((page - 1) * limit)
      .limit(limit);
    
    total = await Product.countDocuments(filter);
  }

  const totalPages = Math.ceil(total / limit);

  return { 
    data: products, 
    totalPages, 
    currentPage: page,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
async function createProduct(producto) {
    await connectDB();
    const { nombre, descripcion, precio, stock, imagen, categoria, destacado } = producto;
    if (!nombre || !descripcion || !precio || !stock || !imagen || !categoria) {
        throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' });
    }
    const newProduct = await Product.create({ nombre, descripcion, precio, stock, imagen, categoria, destacado: destacado || false });
    return newProduct;  

}

async function deleteProduct(id) {
    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' });
    }
    return { message: 'Producto eliminado correctamente' };
}   

async function updateProduct(id, productData) {
    await connectDB();

    const allowedFields = ['nombre', 'descripcion', 'precio', 'stock', 'imagen', 'categoria', 'destacado'];
    const updateData = {};

    for (const field of allowedFields) {
        if (productData[field] !== undefined) {
            updateData[field] = productData[field];
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' });
    }

    return updatedProduct;
}

export { getProducts, getProductById, createProduct, deleteProduct, updateProduct };