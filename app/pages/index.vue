<script setup>
import { ref, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const products = ref([])
const { addToCart, setUserFromStorage, fetchCart } = useCart()

const fetchProducts = async () => {
  try {
    products.value = await $fetch('/api/products/allProducts')
  } catch (err) {
    alert(err.message || 'Error al cargar productos')
  }
}

onMounted(() => {
  setUserFromStorage()
  fetchCart()
  fetchProducts()
})
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Tienda</h1>
      <div class="columns is-multiline">
        <div class="column is-one-quarter" v-for="prod in products" :key="prod._id">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="prod.imagen" :alt="prod.name" />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-5">{{ prod.name }}</p>
              <p class="subtitle is-6">$ {{ prod.precio }}</p>
              <p>{{ prod.descripcion.substring(0, 50) }}...</p>
            </div>
            <footer class="card-footer">
              <NuxtLink :to="`/product/${prod._id}`" class="card-footer-item">Ver detalles</NuxtLink>
              <a class="card-footer-item" @click.prevent="addToCart(prod._id)">Agregar al carrito</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>