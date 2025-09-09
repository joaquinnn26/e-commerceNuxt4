<template>
  <div class="box">
    <h2 class="title is-5 mb-4">Productos</h2>
    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in products" 
            :key="product._id" 
            :class="{ 'has-background-danger-light': product.stock < 5 }"
          >
            <td>{{ product.nombre }}</td>
            <td>${{ product.precio }}</td>
            <td>{{ product.stock }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: Array
})
</script>