<script setup>
import { ref, onMounted } from 'vue'
import ProductModal from '~/components/ProductModal.vue'
import Swal from 'sweetalert2'
import { Settings, PlusCircle, Edit, Trash2 } from 'lucide-vue-next'

const products = ref([])
const showModal = ref(false)
const modalMode = ref('create')
const currentProduct = ref({ nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' })
const expandedDescriptions = ref({})
let token = ref(null)

// Variables para búsqueda y paginación
const searchTerm = ref('')
const isSearching = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalProducts = ref(0)
const itemsPerPage = 8

// Traer productos con paginación y búsqueda
const fetchProducts = async (page = 1) => {
  isSearching.value = true
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      search: searchTerm.value
    })
    
    const res = await $fetch(`/api/products/paginated?${queryParams}`)
    products.value = res.data
    currentPage.value = res.pagination.currentPage
    totalPages.value = res.pagination.totalPages
    totalProducts.value = res.pagination.totalProducts
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al cargar productos'
    })
  } finally {
    isSearching.value = false
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
    currentProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' }
    
    await fetchProducts(currentPage.value)
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
  currentProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' }
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
    await fetchProducts(currentPage.value)
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

// Funciones de búsqueda y paginación
const handleSearch = async () => {
  currentPage.value = 1 // Resetear a la primera página
  await fetchProducts(1)
}

const clearSearch = async () => {
  searchTerm.value = ''
  currentPage.value = 1
  await fetchProducts(1)
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

<style scoped>
/* ===== ESTILOS RESPONSIVE PARA PRODUCTOS ===== */

/* Contenedor principal con márgenes */
.section {
  padding: 1rem;
}

@media (max-width: 768px) {
  .section {
    padding: 0.75rem;
  }
  
  /* Título principal */
  .title {
    font-size: 1.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .subtitle {
    font-size: 1rem !important;
    margin-bottom: 1rem !important;
  }
  
  /* Botón crear producto */
  .button.mb-4 {
    margin-bottom: 1rem !important;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    width: 100%;
  }
  
  /* Barra de búsqueda */
  .box {
    margin-bottom: 1rem !important;
    padding: 1rem !important;
  }
  
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
    margin-bottom: 1rem !important;
  }
  
  /* Tarjetas móviles */
  .box.mb-4 {
    margin-bottom: 1rem !important;
    padding: 1rem !important;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .title.is-6 {
    font-size: 1rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .is-size-7 {
    font-size: 0.75rem !important;
    margin-bottom: 0.25rem !important;
    line-height: 1.4;
  }
  
  /* Imagen del producto */
  img {
    width: 50px !important;
    height: 50px !important;
    border-radius: 6px;
  }
  
  /* Tags */
  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  /* Botones de acción */
  .is-flex.is-flex-wrap-wrap {
    gap: 0.5rem;
    margin-top: 0.75rem !important;
  }
  
  .button {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-width: auto;
    flex: 1;
  }
  
  /* Paginación */
  .pagination-container {
    margin-top: 1.5rem !important;
    padding: 0 0.5rem;
  }
  
  .pagination {
    font-size: 0.875rem;
  }
  
  .pagination-previous,
  .pagination-next {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
  
  .pagination-link {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-width: 2.5rem;
  }
  
  /* Notificaciones */
  .notification {
    margin-bottom: 1rem !important;
    padding: 1rem !important;
    font-size: 0.875rem;
  }
  
  /* Tabla desktop (oculta en móvil) */
  .is-hidden-mobile {
    display: none !important;
  }
  
  /* Vista móvil */
  .is-hidden-tablet {
    display: block !important;
  }
}

@media (max-width: 480px) {
  .section {
    padding: 0.5rem;
  }
  
  .box {
    padding: 0.75rem !important;
  }
  
  .title {
    font-size: 1.25rem !important;
  }
  
  .button {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
  
  .pagination-link {
    min-width: 2rem;
    padding: 0.4rem 0.6rem;
  }
  
  img {
    width: 45px !important;
    height: 45px !important;
  }
}

/* Estilos para descripción expandible */
.button.is-text.is-paddingless {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  margin-left: 0.25rem;
}

/* Mejorar espaciado de elementos */
.mb-3 {
  margin-bottom: 0.75rem !important;
}

.mb-4 {
  margin-bottom: 1rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.mt-3 {
  margin-top: 0.75rem !important;
}
</style>

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
      <button class="button mb-4" @click="createProduct" style="background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%); color: white; border: none;">
        <PlusCircle :size="18" class="mr-2" />
        Crear Producto
      </button>

      <!-- Barra de búsqueda -->
      <div class="box mb-4">
        <div class="field has-addons">
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
        <p class="help is-info">
          Puedes buscar por: nombre del producto, descripción o categoría
        </p>
      </div>

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
                <th>Destacado</th>
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
                <td>
                  <span 
                    class="tag" 
                    :class="prod.destacado ? 'is-success' : 'is-light'"
                  >
                    {{ prod.destacado ? '⭐ Destacado' : 'Normal' }}
                  </span>
                </td>
                <td class="is-clipped" style="max-width: 240px;">
                  <span v-if="!expandedDescriptions[prod._id]">
                    {{ getTruncatedDescription(prod.descripcion) }}
                    <button 
                      v-if="isDescriptionLong(prod.descripcion)" 
                      class="button is-small is-text is-paddingless ml-1" 
                      @click="toggleDescription(prod._id)"
                      style="color: var(--primary-600); text-decoration: underline;"
                    >
                      Ver más
                    </button>
                  </span>
                  <span v-else>
                    {{ prod.descripcion }}
                    <button 
                      class="button is-small is-text is-paddingless ml-1" 
                      @click="toggleDescription(prod._id)"
                      style="color: var(--primary-600); text-decoration: underline;"
                    >
                      Ver menos
                    </button>
                  </span>
                </td>
                <td>
                  <button class="button is-small mr-2 mb-2" @click="editProduct(prod)" style="background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%); color: white; border: none;">
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
                <td colspan="7" class="has-text-centered">
                  <span v-if="searchTerm">
                    No se encontraron productos para la búsqueda "{{ searchTerm }}"
                  </span>
                  <span v-else>
                    No hay productos disponibles
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Paginación desktop -->
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
              <span 
                class="tag is-small" 
                :class="prod.destacado ? 'is-success' : 'is-light'"
              >
                {{ prod.destacado ? '⭐ Destacado' : 'Normal' }}
              </span>
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
                  style="color: var(--primary-600); text-decoration: underline;"
                >
                  Ver más
                </button>
              </span>
              <span v-else>
                {{ prod.descripcion }}
                <button 
                  class="button is-small is-text is-paddingless ml-1" 
                  @click="toggleDescription(prod._id)"
                  style="color: var(--primary-600); text-decoration: underline;"
                >
                  Ver menos
                </button>
              </span>
            </p>
          </div>

          <div class="is-flex is-flex-wrap-wrap" style="gap: 0.5rem;">
            <button class="button is-small" @click="editProduct(prod)" style="background: linear-gradient(135deg, var(--primary-600) 0%, var(--secondary-600) 100%); color: white; border: none;">
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
          <span v-if="searchTerm">
            No se encontraron productos para la búsqueda "{{ searchTerm }}"
            <br>
            <button @click="clearSearch" class="button is-small is-warning mt-2">
              Limpiar búsqueda
            </button>
          </span>
          <span v-else>
            No hay productos disponibles
          </span>
        </div>
        
        <!-- Paginación móvil -->
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