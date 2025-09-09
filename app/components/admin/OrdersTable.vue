<script setup>
import { Check } from 'lucide-vue-next'

const props = defineProps({
  orders: Array
})

const emit = defineEmits(['confirm'])

const confirmOrder = async (id) => {
  try {
    await $fetch(`/api/orders/${id}/confirm`, { method: 'POST' })
    emit('confirm')
  } catch (err) {
    console.error('Error confirmando orden', err)
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
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.customerName }}</td>
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
