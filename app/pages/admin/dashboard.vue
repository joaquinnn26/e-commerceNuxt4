<script setup>
import { ref, onMounted } from 'vue'
import KpiCard from '~/components/admin/KpiCard.vue'
import OrdersTable from '~/components/admin/OrdersTable.vue'
import ProductsTable from '~/components/admin/ProductsTable.vue'

const orders = ref([])
const products = ref([])

const fetchData = async () => {
  orders.value = await $fetch('/api/orders?status=pendiente')
  products.value = await $fetch('/api/products/allProducts')
}
const fetchOrders = async () => {
  orders.value = await $fetch('/api/orders?status=pendiente') 
}
const fetchProducts = async () => {
  products.value = await $fetch('/api/products/allProducts')
}
onMounted(()=>{
  fetchProducts()
  fetchOrders()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Pedidos pendientes" :value="orders.length" />
      <KpiCard title="Total productos" :value="products.length" />
      <KpiCard title="Stock bajo" :value="products.filter(p => p.stock < 5).length" />
    </div>

    <!-- Tabla pedidos -->
    <OrdersTable :orders="orders" @update="fetchData" />

    <!-- Tabla productos -->
    <ProductsTable :products="products" @update="fetchData" />
  </div>
</template>