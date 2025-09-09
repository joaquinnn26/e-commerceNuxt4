<script setup>
import { ref, onMounted } from 'vue'
import KpiCard from '~/components/admin/KpiCard.vue'
import OrdersTable from '~/components/admin/OrdersTable.vue'
import ProductsTable from '~/components/admin/ProductsTable.vue'
import { Settings } from 'lucide-vue-next'

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
definePageMeta({
  middleware: ['admin']
})
onMounted(()=>{
  fetchProducts()
  fetchOrders()
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="has-text-centered mb-6">
        <h1 class="title text-gradient">
          <Settings :size="24" class="mr-3" />
          Panel de Administración
        </h1>
        <p class="subtitle is-5 has-text-grey">Resumen general de tu tienda</p>
      </div>
      
      <!-- Tarjetas resumen -->
      <div class="columns is-multiline mb-6">
        <div class="column is-one-third-desktop is-half-tablet">
          <KpiCard title="Pedidos pendientes" :value="orders.length" />
        </div>
        <div class="column is-one-third-desktop is-half-tablet">
          <KpiCard title="Total productos" :value="products.length" />
        </div>
        <div class="column is-one-third-desktop is-half-tablet">
          <KpiCard title="Stock bajo" :value="products.filter(p => p.stock < 5).length" />
        </div>
      </div>

      <!-- Tabla pedidos -->
      <div class="mb-6">
        <OrdersTable :orders="orders" @update="fetchData" />
      </div>

      <!-- Tabla productos -->
      <ProductsTable :products="products" @update="fetchData" />
    </div>
  </section>
</template>