<template>
  <div class="bg-white shadow rounded-lg p-4">
    <h2 class="text-lg font-bold mb-4">Productos</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b">
          <th class="p-2 text-left">Nombre</th>
          <th class="p-2 text-left">Precio</th>
          <th class="p-2 text-left">Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="product in products" 
          :key="product._id" 
          :class="{ 'bg-red-100': product.stock < 5 }"
        >
          <td class="p-2">{{ product.nombre }}</td>
          <td class="p-2">${{ product.precio }}</td>
          <td class="p-2">{{ product.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  products: Array
})
</script>