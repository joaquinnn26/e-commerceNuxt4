import { connectDB } from '~~/server/utils/db.js';
import Product from '~~/server/models/products.js';
 


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

  const filter = {};

  // Filtrar por categoría si existe
  if (category) filter.categoria = category;

  // Filtrar por búsqueda en el nombre si existe
  if (search) filter.nombre = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { data, totalPages, currentPage: page };
};
async function createProduct(producto) {
    await connectDB();
    const { nombre, descripcion, precio, stock, imagen, categoria } = producto;
    if (!nombre || !descripcion || !precio || !stock || !imagen || !categoria) {
        throw createError({ statusCode: 400, statusMessage: 'Todos los campos son obligatorios' });
    }
    const newProduct = await Product.create({ nombre, descripcion, precio, stock, imagen, categoria });
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

    const allowedFields = ['nombre', 'descripcion', 'precio', 'stock', 'imagen'];
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