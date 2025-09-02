<script setup>
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
  <div class="bg-white shadow rounded-lg p-4">
    <h2 class="text-lg font-bold mb-4">Pedidos pendientes</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b">
          <th class="p-2 text-left">ID</th>
          <th class="p-2 text-left">Cliente</th>
          <th class="p-2 text-left">Total</th>
          <th class="p-2 text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id" class="border-b">
          <td class="p-2">{{ order._id }}</td>
          <td class="p-2">{{ order.customerName }}</td>
          <td class="p-2">${{ order.total }}</td>
          <td class="p-2">
            <button 
              class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              @click="confirmOrder(order._id)"
            >
              Confirmar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
