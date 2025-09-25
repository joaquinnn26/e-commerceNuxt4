<script setup>
import { Check } from 'lucide-vue-next'

const props = defineProps({
  orders: Array
})

const emit = defineEmits(['confirm'])

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

const confirmOrder = async (id) => {
  try {
    await $fetch(`/api/orders/confirm/${id}`, { method: 'POST' })
    emit('confirm')
  } catch (err) {
    // Error silencioso - el usuario ya ve el resultado
  }
}
</script>

<template>
  <div class="box">
    <h2 class="title is-5 mb-4">Pedidos pendientes</h2>
    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.userId?.name || 'N/A' }}</td>
            <td>{{ order.userId?.telefono || 'N/A' }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>${{ order.total }}</td>
            <td>
              <button 
                class="button is-small"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;"
                @click="confirmOrder(order._id)"
              >
                <Check :size="14" class="mr-1" />
                Confirmar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
