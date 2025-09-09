<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { ShoppingBag, Loader2, AlertTriangle, Check, Trash2 } from 'lucide-vue-next'

// Estado
const orders = ref([])
const loading = ref(false)
const error = ref(null)

// Función para traer todas las órdenes
const fetchOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch('/api/orders/allOrders')
    orders.value = res
  } catch (err) {
    error.value = err.message || 'Error al cargar órdenes'
  } finally {
    loading.value = false
  }
}
const borrarOrden = async (orderId) => {
  if (!confirm('¿Estás seguro de que deseas borrar esta orden?')) return
  try {
    await $fetch(`/api/orders/${orderId}`, { method: 'DELETE' })
    Swal.fire('¡Éxito!', 'Orden borrada', 'success')
    fetchOrders()
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
    fetchOrders()
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
definePageMeta({
  middleware: ['admin']
})
</script>

<template>
  <section class="section">
    <div class="has-text-centered mb-6">
      <h1 class="title text-gradient">
        <ShoppingBag :size="24" class="mr-3" />
        Órdenes de Compra
      </h1>
      <p class="subtitle is-5 has-text-grey">Gestiona las órdenes de tus clientes</p>
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
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{  order.userId.email }}</td>
            <td>
              <ul>
                <li v-for="item in order.items" :key="item.productId">{{ item.productId?.nombre || 'Producto eliminado' }} x {{ item.quantity }}</li>
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
        <p class="is-size-7 has-text-grey">Usuario: {{ order.userId.email }}</p>
        <ul class="mt-2" style="list-style: disc; padding-left: 1rem;">
          <li class="is-size-7" v-for="item in order.items" :key="item.productId">{{ item.productId?.nombre || 'Producto eliminado' }} x {{ item.quantity }}</li>
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

    <div v-else class="notification is-warning">No hay órdenes para mostrar</div>
  </section>
</template>