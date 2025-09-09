<script setup>
import { ref, onMounted } from 'vue'
import ProductModal from '~/components/ProductModal.vue'
import Swal from 'sweetalert2'
import { Settings, PlusCircle, Edit, Trash2 } from 'lucide-vue-next'

const products = ref([])
const showModal = ref(false)
const modalMode = ref('create')
const currentProduct = ref({ nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', _id: '' })
const expandedDescriptions = ref({})
let token = ref(null)

// Traer productos
const fetchProducts = async () => {
  try {
    products.value = await $fetch('/api/products/allProducts')
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al cargar productos'
    })
  }
}

// Guardar producto (crear o editar)
const saveProduct = async (product) => {
  try {
    const productToSend = {
      ...product,
      stock: product.stock ?? 0,
      imagen: product.imagen ?? '',
      precio: Number(product.precio)
    }

    if (modalMode.value === 'create') {
      await $fetch('/api/products/admin/createProduct', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: productToSend
      })
      Swal.fire('¡Éxito!', 'Producto creado correctamente', 'success')
    } else {
      await $fetch(`/api/products/admin/${product._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: productToSend
      })
      Swal.fire('¡Éxito!', 'Producto actualizado correctamente', 'success')
    }

    // Cerrar modal y resetear estado
    showModal.value = false
    modalMode.value = 'create'
    currentProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', _id: '' }
    
    await fetchProducts()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al guardar producto'
    })
  }
}

// Editar producto
const editProduct = (prod) => {
  currentProduct.value = { ...prod }
  modalMode.value = 'edit'
  showModal.value = true
}

// Crear producto
const createProduct = () => {
  // Resetear completamente el estado
  currentProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', _id: '' }
  modalMode.value = 'create'
  showModal.value = true
}

// Eliminar producto
const deleteProduct = async (id) => {
  if (!confirm('¿Seguro querés eliminar este producto?')) return
  try {
    await $fetch(`/api/products/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    await fetchProducts()
    Swal.fire('¡Éxito!', 'Producto eliminado correctamente', 'success')
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al eliminar producto'
    })
  }
}

// Funciones para manejar descripción expandida
const toggleDescription = (productId) => {
  expandedDescriptions.value[productId] = !expandedDescriptions.value[productId]
}

const getTruncatedDescription = (description, maxLength = 50) => {
  if (!description) return ''
  return description.length > maxLength ? description.substring(0, maxLength) + '...' : description
}

const isDescriptionLong = (description, maxLength = 50) => {
  return description && description.length > maxLength
}

definePageMeta({ middleware: 'admin' })

onMounted(() => {
  fetchProducts()
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const userObj = JSON.parse(storedUser)
    token.value = userObj.token
  }
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered mb-6">
        <h1 class="title text-gradient">
          <Settings :size="24" class="mr-3" />
          Panel de Productos
        </h1>
        <p class="subtitle is-5 has-text-grey">Gestiona tu inventario de productos</p>
      </div>
      <button class="button mb-4" @click="createProduct" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
        <PlusCircle :size="18" class="mr-2" />
        Crear Producto
      </button>

      <!-- Vista desktop: tabla -->
      <div class="is-hidden-mobile">
        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoria</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in products" :key="prod._id">
                <td>
                  <img v-if="prod.imagen" :src="prod.imagen" alt="" style="width: 50px; height:50px; object-fit:cover;" />
                </td>
                <td>{{ prod.nombre }}</td>
                <td>{{ prod.precio }}</td>
                <td>{{ prod.categoria }}</td>
                <td class="is-clipped" style="max-width: 240px;">
                  <span v-if="!expandedDescriptions[prod._id]">
                    {{ getTruncatedDescription(prod.descripcion) }}
                    <button 
                      v-if="isDescriptionLong(prod.descripcion)" 
                      class="button is-small is-text is-paddingless ml-1" 
                      @click="toggleDescription(prod._id)"
                      style="color: #667eea; text-decoration: underline;"
                    >
                      Ver más
                    </button>
                  </span>
                  <span v-else>
                    {{ prod.descripcion }}
                    <button 
                      class="button is-small is-text is-paddingless ml-1" 
                      @click="toggleDescription(prod._id)"
                      style="color: #667eea; text-decoration: underline;"
                    >
                      Ver menos
                    </button>
                  </span>
                </td>
                <td>
                  <button class="button is-small mr-2 mb-2" @click="editProduct(prod)" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                    <Edit :size="14" class="mr-1" />
                    Editar
                  </button>
                  <button class="button is-small is-danger mb-2" @click="deleteProduct(prod._id)">
                    <Trash2 :size="14" class="mr-1" />
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="has-text-centered">No hay productos disponibles</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista móvil: cards -->
      <div class="is-hidden-tablet">
        <div v-for="prod in products" :key="prod._id" class="box mb-4">
          <div class="is-flex is-align-items-center mb-3">
            <img v-if="prod.imagen" :src="prod.imagen" alt="" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;" />
            <div class="is-flex-grow-1">
              <h3 class="title is-6 mb-1">{{ prod.nombre }}</h3>
              <p class="has-text-weight-semibold has-text-primary">$ {{ prod.precio }}</p>
              <p class="is-size-7 has-text-grey">{{ prod.categoria }}</p>
            </div>
          </div>
          
          <div class="mb-3">
            <p class="is-size-7">
              <span v-if="!expandedDescriptions[prod._id]">
                {{ getTruncatedDescription(prod.descripcion, 80) }}
                <button 
                  v-if="isDescriptionLong(prod.descripcion, 80)" 
                  class="button is-small is-text is-paddingless ml-1" 
                  @click="toggleDescription(prod._id)"
                  style="color: #667eea; text-decoration: underline;"
                >
                  Ver más
                </button>
              </span>
              <span v-else>
                {{ prod.descripcion }}
                <button 
                  class="button is-small is-text is-paddingless ml-1" 
                  @click="toggleDescription(prod._id)"
                  style="color: #667eea; text-decoration: underline;"
                >
                  Ver menos
                </button>
              </span>
            </p>
          </div>

          <div class="is-flex is-flex-wrap-wrap" style="gap: 0.5rem;">
            <button class="button is-small" @click="editProduct(prod)" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
              <Edit :size="14" class="mr-1" />
              Editar
            </button>
            <button class="button is-small is-danger" @click="deleteProduct(prod._id)">
              <Trash2 :size="14" class="mr-1" />
              Eliminar
            </button>
          </div>
        </div>
        
        <div v-if="products.length === 0" class="box has-text-centered">
          <p>No hay productos disponibles</p>
        </div>
      </div>

      <!-- Modal -->
      <ProductModal
        v-model:is-active="showModal"
        v-model:model-value="currentProduct"
        :mode="modalMode"
        @save="saveProduct"
      />
    </div>
  </section>
</template>