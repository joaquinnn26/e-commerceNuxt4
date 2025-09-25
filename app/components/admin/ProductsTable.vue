<template>
  <div class="box">
    <h2 class="title is-5 mb-4">Gestión de Productos</h2>
    
    <!-- Barra de búsqueda -->
    <div class="field has-addons mb-4">
      <div class="control is-expanded">
        <input 
          v-model="searchTerm"
          @keyup.enter="handleSearch"
          class="input" 
          type="text" 
          placeholder="Buscar por nombre, descripción o categoría del producto..."
        />
      </div>
      <div class="control">
        <button 
          @click="handleSearch"
          :disabled="isSearching"
          class="button is-primary"
          :class="{ 'is-loading': isSearching }"
        >
          Buscar
        </button>
      </div>
      <div class="control" v-if="searchTerm">
        <button 
          @click="clearSearch"
          class="button is-light"
        >
          Limpiar
        </button>
      </div>
    </div>
    
    <p class="help is-info mb-4">
      Puedes buscar por: nombre del producto, descripción o categoría
    </p>

    <!-- Contador de resultados -->
    <div v-if="products.length > 0" class="mb-4">
      <p class="is-size-7 has-text-grey">
        <span v-if="searchTerm">
          Mostrando {{ products.length }} de {{ totalProducts }} productos encontrados
          <br>
          <strong>Búsqueda: "{{ searchTerm }}"</strong>
        </span>
        <span v-else>
          Mostrando {{ products.length }} de {{ totalProducts }} productos
        </span>
      </p>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in products" 
            :key="product._id" 
            :class="{ 'has-background-danger-light': product.stock < 5 }"
          >
            <td>
              <figure class="image is-48x48">
                <img :src="product.imagen" :alt="product.nombre" style="object-fit: cover;" />
              </figure>
            </td>
            <td>{{ product.nombre }}</td>
            <td>${{ product.precio }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span class="tag is-info">{{ product.categoria }}</span>
            </td>
            <td>
              <span 
                class="tag" 
                :class="product.destacado ? 'is-success' : 'is-light'"
              >
                {{ product.destacado ? '⭐ Destacado' : 'Normal' }}
              </span>
            </td>
            <td>
              <div class="buttons are-small">
                <button 
                  class="button" 
                  :class="product.destacado ? 'is-warning' : 'is-success'"
                  @click="toggleFeatured(product._id, product.destacado)"
                  :disabled="isLoading"
                >
                  {{ product.destacado ? 'Quitar Destacado' : 'Marcar Destacado' }}
                </button>
                <button 
                  class="button is-danger is-small"
                  @click="deleteProduct(product._id)"
                  :disabled="isLoading"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="products.length && totalPages > 1" class="pagination-container mt-5">
      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <button 
          class="pagination-previous" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Anterior
        </button>
        
        <ul class="pagination-list">
          <li v-for="page in getVisiblePages()" :key="page">
            <button 
              class="pagination-link"
              :class="{ 'is-current': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </li>
        </ul>
        
        <button 
          class="pagination-next" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Siguiente
        </button>
      </nav>
    </div>

    <!-- Mensaje cuando no hay productos -->
    <div v-if="!isLoading && products.length === 0" class="notification is-warning">
      <span v-if="searchTerm">
        No se encontraron productos para la búsqueda "{{ searchTerm }}"
        <br>
        <button @click="clearSearch" class="button is-small is-warning mt-2">
          Limpiar búsqueda
        </button>
      </span>
      <span v-else>
        No hay productos para mostrar
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  products: Array
})

const emit = defineEmits(['refresh'])

const isLoading = ref(false)
const isSearching = ref(false)
const searchTerm = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalProducts = ref(0)
const itemsPerPage = 8

// Estado local para productos
const localProducts = ref([])

// Función para cargar productos con paginación y búsqueda
const fetchProducts = async (page = 1) => {
  isSearching.value = true
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      search: searchTerm.value
    })
    
    const res = await $fetch(`/api/products/paginated?${queryParams}`)
    localProducts.value = res.data
    currentPage.value = res.pagination.currentPage
    totalPages.value = res.pagination.totalPages
    totalProducts.value = res.pagination.totalProducts
  } catch (err) {
    localProducts.value = []
  } finally {
    isSearching.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchProducts(page)
}

const getVisiblePages = () => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const handleSearch = async () => {
  currentPage.value = 1 // Resetear a la primera página
  await fetchProducts(1)
}

const clearSearch = async () => {
  searchTerm.value = ''
  currentPage.value = 1
  await fetchProducts(1)
}

// Usar productos locales si están disponibles, sino usar los props
const products = computed(() => {
  return localProducts.value.length > 0 ? localProducts.value : props.products
})

onMounted(() => {
  // Si no hay productos locales, cargar con paginación
  if (props.products && props.products.length > 0) {
    localProducts.value = props.products
    totalProducts.value = props.products.length
  } else {
    fetchProducts(1)
  }
})

const toggleFeatured = async (productId, currentStatus) => {
  isLoading.value = true
  try {
    await $fetch(`/api/products/admin/${productId}`, {
      method: 'PUT',
      body: {
        destacado: !currentStatus
      }
    })
    
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: `Producto ${!currentStatus ? 'marcado como destacado' : 'removido de destacados'}`,
      confirmButtonColor: '#4f46e5'
    })
    
    // Refrescar la página actual
    await fetchProducts(currentPage.value)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el producto',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (productId) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    isLoading.value = true
    try {
      await $fetch(`/api/products/admin/${productId}`, {
        method: 'DELETE'
      })
      
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado',
        confirmButtonColor: '#4f46e5'
      })
      
      // Refrescar la página actual
      await fetchProducts(currentPage.value)
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto',
        confirmButtonColor: '#4f46e5'
      })
    } finally {
      isLoading.value = false
    }
  }
}
</script>

<style scoped>
/* ===== ESTILOS RESPONSIVE PARA PRODUCTS TABLE ===== */

@media (max-width: 768px) {
  /* Contenedor principal */
  .box {
    margin: 0.5rem;
    padding: 0.75rem;
  }
  
  /* Título */
  .title.is-5 {
    font-size: 1.25rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  /* Barra de búsqueda */
  .field.has-addons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .field.has-addons .control {
    margin-bottom: 0;
  }
  
  .field.has-addons .control:not(:last-child) {
    margin-right: 0;
  }
  
  .input {
    font-size: 16px; /* Evita zoom en iOS */
    margin-bottom: 0.5rem;
  }
  
  .button {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
  
  /* Contador de resultados */
  .is-size-7 {
    font-size: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  /* Tabla responsive */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .table {
    font-size: 0.75rem;
    min-width: 600px;
  }
  
  .table th,
  .table td {
    padding: 0.5rem 0.25rem;
    vertical-align: middle;
  }
  
  /* Imágenes en tabla */
  .image.is-48x48 {
    width: 32px;
    height: 32px;
  }
  
  /* Tags */
  .tag {
    font-size: 0.625rem;
    padding: 0.2rem 0.4rem;
  }
  
  /* Botones de acción */
  .buttons.are-small {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .buttons.are-small .button {
    font-size: 0.625rem;
    padding: 0.4rem 0.6rem;
    width: 100%;
  }
  
  /* Paginación */
  .pagination-container {
    margin-top: 1rem !important;
    padding: 0 0.5rem;
  }
  
  .pagination {
    font-size: 0.75rem;
  }
  
  .pagination-previous,
  .pagination-next {
    font-size: 0.625rem;
    padding: 0.4rem 0.6rem;
  }
  
  .pagination-link {
    font-size: 0.625rem;
    padding: 0.4rem 0.6rem;
    min-width: 2rem;
  }
  
  /* Notificaciones */
  .notification {
    margin-bottom: 0.75rem !important;
    padding: 0.75rem !important;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .box {
    margin: 0.25rem;
    padding: 0.5rem;
  }
  
  .title.is-5 {
    font-size: 1.125rem !important;
  }
  
  .table {
    font-size: 0.625rem;
    min-width: 500px;
  }
  
  .table th,
  .table td {
    padding: 0.4rem 0.2rem;
  }
  
  .image.is-48x48 {
    width: 28px;
    height: 28px;
  }
  
  .button {
    font-size: 0.625rem;
    padding: 0.3rem 0.5rem;
  }
  
  .pagination-link {
    min-width: 1.75rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>