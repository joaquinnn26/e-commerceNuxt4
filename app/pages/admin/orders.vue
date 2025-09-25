<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { ShoppingBag, Loader2, AlertTriangle, Check, Trash2 } from 'lucide-vue-next'

// Estado
const orders = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalOrders = ref(0)
const itemsPerPage = 8
const searchTerm = ref('')
const isSearching = ref(false)

// Cache para mejorar rendimiento
const cache = ref(new Map())
const lastFetchTime = ref(0)
const CACHE_DURATION = 30000 // 30 segundos

// Función optimizada para traer órdenes con caché
const fetchOrders = async (page = 1, forceRefresh = false) => {
  const cacheKey = `${page}-${searchTerm.value}`
  const now = Date.now()
  
  // Verificar caché si no es forzado
  if (!forceRefresh && cache.value.has(cacheKey) && (now - lastFetchTime.value) < CACHE_DURATION) {
    const cachedData = cache.value.get(cacheKey)
    orders.value = cachedData.orders
    currentPage.value = cachedData.pagination.currentPage
    totalPages.value = cachedData.pagination.totalPages
    totalOrders.value = cachedData.pagination.totalOrders
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      search: searchTerm.value
    })
    
    const res = await $fetch(`/api/orders/allOrders?${queryParams}`)
    
    // Actualizar estado
    orders.value = res.orders
    currentPage.value = res.pagination.currentPage
    totalPages.value = res.pagination.totalPages
    totalOrders.value = res.pagination.totalOrders
    
    // Guardar en caché
    cache.value.set(cacheKey, res)
    lastFetchTime.value = now
    
  } catch (err) {
    error.value = err.message || 'Error al cargar órdenes'
  } finally {
    loading.value = false
  }
}
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchOrders(page)
}

// Debounce para búsqueda
let searchTimeout = null

const handleSearch = async () => {
  isSearching.value = true
  
  // Limpiar timeout anterior
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Debounce de 300ms
  searchTimeout = setTimeout(async () => {
    currentPage.value = 1
    cache.value.clear() // Limpiar caché al buscar
    await fetchOrders(1, true)
    isSearching.value = false
  }, 300)
}

const clearSearch = async () => {
  searchTerm.value = ''
  currentPage.value = 1
  cache.value.clear() // Limpiar caché
  await fetchOrders(1, true)
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

const borrarOrden = async (orderId) => {
  if (!confirm('¿Estás seguro de que deseas borrar esta orden?')) return
  try {
    await $fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
    Swal.fire('¡Éxito!', 'Orden borrada', 'success')
    fetchOrders(currentPage.value)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al borrar orden'
    })
  }
}
// Confirmar orden
const confirmOrder = async (orderId) => {
  try {
    await $fetch(`/api/orders/confirm/${orderId}`, { method: 'POST' })
    Swal.fire('¡Éxito!', 'Orden confirmada', 'success')
    cache.value.clear() // Limpiar caché después de modificar
    fetchOrders(currentPage.value, true)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al confirmar orden'
    })
  }
}

onMounted(() => {
  fetchOrders()
})

// Filtro de moneda opcional
const currency = (value) => {
  if (!value) return '$0'
  return '$' + Number(value).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
definePageMeta({
  middleware: ['admin']
})
</script>

<style scoped>
/* ===== ESTILOS RESPONSIVE PARA ÓRDENES ===== */

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
  .box.mb-3 {
    margin-bottom: 1rem !important;
    padding: 1rem !important;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .is-size-6 {
    font-size: 1rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  .is-size-7 {
    font-size: 0.75rem !important;
    margin-bottom: 0.25rem !important;
    line-height: 1.4;
  }
  
  /* Lista de productos */
  ul {
    margin-top: 0.5rem !important;
    margin-bottom: 0.5rem !important;
  }
  
  li {
    margin-bottom: 0.25rem !important;
  }
  
  /* Botones de acción */
  .buttons {
    margin-top: 0.75rem !important;
    gap: 0.5rem;
  }
  
  .button {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-width: auto;
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
  
  /* Tags */
  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
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
}
</style>

<template>
  <section class="section">
    <div class="has-text-centered mb-6">
      <h1 class="title text-gradient">
        <ShoppingBag :size="24" class="mr-3" />
        Órdenes de Compra
      </h1>
      <p class="subtitle is-5 has-text-grey">Gestiona las órdenes de tus clientes</p>
    </div>

    <!-- Barra de búsqueda -->
    <div class="box mb-5">
      <div class="field has-addons">
        <div class="control is-expanded">
          <input 
            v-model="searchTerm"
            @keyup.enter="handleSearch"
            class="input" 
            type="text" 
            placeholder="Buscar por ID de orden, email, teléfono o nombre del cliente..."
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
        Puedes buscar por: ID de orden, email del cliente, teléfono o nombre del cliente
      </p>
    </div>

    <div v-if="loading" class="notification is-info">
      <Loader2 :size="18" class="mr-2" />
      Cargando órdenes...
    </div>
    <div v-if="error" class="notification is-danger">
      <AlertTriangle :size="18" class="mr-2" />
      {{ error }}
    </div>

    <!-- Desktop: tabla -->
    <div class="table-container is-hidden-touch" v-if="orders.length">
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Usuario</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.userId?.name || order.userId?.email || 'N/A' }}</td>
            <td>{{ order.userId?.telefono || 'N/A' }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <ul>
                <li v-for="item in order.items" :key="item.productId">{{ item.productName || item.productId?.nombre || 'Producto eliminado' }} x {{ item.quantity }}</li>
              </ul>
            </td>
            <td>{{ currency(order.total) }}</td>
            <td>
              <span
                class="tag"
                :class="order.estado === 'pendiente' ? 'is-warning' : 'is-success'"
              >
                {{ order.estado }}
              </span>
            </td>
            <td>
              <button
                v-if="order.estado === 'pendiente'"
                class="button is-small"
                @click="confirmOrder(order._id)"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;"
              >
                <Check :size="14" class="mr-1" />
                Confirmar
              </button>
              <button @click="borrarOrden(order._id)" class="button is-small is-danger">
                <Trash2 :size="14" class="mr-1" />
                Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: tarjetas -->
    <div class="is-hidden-desktop" v-if="orders.length">
      <div class="box mb-3" v-for="order in orders" :key="order._id">
        <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">
          <strong class="is-size-6">Orden: {{ order._id }}</strong>
          <span class="tag" :class="order.estado === 'pendiente' ? 'is-warning' : 'is-success'">{{ order.estado }}</span>
        </div>
        <p class="is-size-7 has-text-grey">Usuario: {{ order.userId?.name || order.userId?.email || 'N/A' }}</p>
        <p class="is-size-7 has-text-grey">Teléfono: {{ order.userId?.telefono || 'N/A' }}</p>
        <p class="is-size-7 has-text-grey">Fecha: {{ formatDate(order.createdAt) }}</p>
        <ul class="mt-2" style="list-style: disc; padding-left: 1rem;">
          <li class="is-size-7" v-for="item in order.items" :key="item.productId">{{ item.productName || item.productId?.nombre || 'Producto eliminado' }} x {{ item.quantity }}</li>
        </ul>
        <div class="is-flex is-justify-content-space-between is-align-items-center mt-3">
          <span class="has-text-weight-semibold">Total: {{ currency(order.total) }}</span>
          <div>
            <button v-if="order.estado === 'pendiente'" class="button is-small mr-2" @click="confirmOrder(order._id)" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
              <Check :size="14" class="mr-1" />
              Confirmar
            </button>
            <button class="button is-small is-danger" @click="borrarOrden(order._id)">
              <Trash2 :size="14" class="mr-1" />
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="orders.length && totalPages > 1" class="pagination-container mt-5">
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
      
      <div class="has-text-centered mt-3">
        <p class="is-size-7 has-text-grey">
          <span v-if="searchTerm">
            Mostrando {{ orders.length }} de {{ totalOrders }} órdenes encontradas
            <br>
            <strong>Búsqueda: "{{ searchTerm }}"</strong>
          </span>
          <span v-else>
            Mostrando {{ orders.length }} de {{ totalOrders }} órdenes
          </span>
        </p>
      </div>
    </div>

    <!-- Mensaje cuando no hay órdenes -->
    <div v-if="!loading && orders.length === 0" class="notification is-warning">
      <span v-if="searchTerm">
        No se encontraron órdenes para la búsqueda "{{ searchTerm }}"
        <br>
        <button @click="clearSearch" class="button is-small is-warning mt-2">
          Limpiar búsqueda
        </button>
      </span>
      <span v-else>
        No hay órdenes para mostrar
      </span>
    </div>
  </section>
</template>