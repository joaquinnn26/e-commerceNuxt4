<script setup>
import { ref, onMounted } from 'vue'

// Estado
const orders = ref([])
const loading = ref(false)
const error = ref(null)

// Función para traer todas las órdenes
const fetchOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch('/api/orders')
    orders.value = res
  } catch (err) {
    error.value = err.message || 'Error al cargar órdenes'
  } finally {
    loading.value = false
  }
}

// Confirmar orden
const confirmOrder = async (orderId) => {
  try {
    await $fetch(`/api/orders/confirm/${orderId}`, { method: 'POST' })
    alert('Orden confirmada')
    fetchOrders()
  } catch (err) {
    alert(err.message || 'Error al confirmar orden')
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
</script>

<template>
  <section class="section">
    <h1 class="title">Órdenes de Compra</h1>

    <div v-if="loading" class="notification is-info">Cargando órdenes...</div>
    <div v-if="error" class="notification is-danger">{{ error }}</div>

    <table class="table is-fullwidth is-striped is-hoverable" v-if="orders.length">
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
          <td>{{ order.user.email || order.userId }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.productId">{{ item.name }} x {{ item.quantity }}</li>
            </ul>
          </td>
          <td>{{ currency(order.total) }}</td>
          <td>
            <span
              class="tag"
              :class="order.status === 'pending' ? 'is-warning' : 'is-success'"
            >
              {{ order.status }}
            </span>
          </td>
          <td>
            <button
              v-if="order.status === 'pending'"
              class="button is-small is-success"
              @click="confirmOrder(order._id)"
            >
              Confirmar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="notification is-warning">No hay órdenes para mostrar</div>
  </section>
</template>