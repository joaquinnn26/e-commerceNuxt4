<script setup>
import { ref, onMounted } from 'vue'
import ProductModal from '~/components/ProductModal.vue'

const products = ref([])
const showModal = ref(false)
const modalMode = ref('create')
const currentProduct = ref({ nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', _id: '' })

// Traer productos
const fetchProducts = async () => {
  try {
    products.value = await $fetch('/api/products/allProducts')
  } catch (err) {
    alert(err.message || 'Error al cargar productos')
  }
}

// Guardar producto
const saveProduct = async (product) => {
  try {
     const productToSend = {
      ...product,
      stock: product.stock ?? 0,         // si no hay stock, poner 0
      imagen: product.imagen ?? '',      // si no hay imagen, poner ''
      precio: Number(product.precio)     // asegurarse de que sea número
    }
    if (modalMode.value === 'create') {

      await $fetch('/api/products/createProduct', { method: 'POST', body: product })
    } else {
      await $fetch(`/api/products/${product._id}`, { method: 'PUT', body: product })
    }
    await fetchProducts()
  } catch (err) {
    alert(err.message || 'Error al guardar producto en front')
  }
}

const editProduct = (prod) => {
  currentProduct.value = { ...prod }
  modalMode.value = 'edit'
  showModal.value = true
}
const createProduct = () => {
  currentProduct.value = { name: '', precio: 0, descripcion: '', stock: 0, imagen: '' }
  modalMode.value = 'create'
  showModal.value = true
}

const deleteProduct = async (id) => {
  if (!confirm('¿Seguro querés eliminar este producto?')) return
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    await fetchProducts()
  } catch (err) {
    alert(err.message || 'Error al eliminar producto')
  }
}

onMounted(fetchProducts)
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Panel de Productos</h1>
      <button class="button is-primary mb-4" @click="createProduct">Crear Producto</button>

      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoria</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in products" :key="prod._id">
            <td>{{ prod.nombre }}</td>
            <td>{{ prod.precio }}</td>
            <td>{{ prod.categoria }}</td>
            <td>{{ prod.descripcion }}</td>
            <td>
              <button class="button is-small is-info mr-2" @click="editProduct(prod)">Editar</button>
              <button class="button is-small is-danger" @click="deleteProduct(prod._id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ProductModal
        v-model:is-active="showModal"
        v-model:model-value="currentProduct"
        :mode="modalMode"
        @save="saveProduct"
      />
    </div>
  </section>
</template>