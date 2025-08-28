<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)

const fetchProduct = async () => {
  try {
    product.value = await $fetch(`/api/products/${route.params.id}`)
  } catch (err) {
    alert(err.message || 'Error al cargar el producto')
  }
}

onMounted(fetchProduct)
</script>

<template>
  <section class="section" v-if="product">
    <div class="container">
      <div class="columns">
        <div class="column is-half">
          <figure class="image">
            <img :src="product.imagen" :alt="product.name" />
          </figure>
        </div>
        <div class="column is-half">
          <h1 class="title">{{ product.name }}</h1>
          <h2 class="subtitle">$ {{ product.precio }}</h2>
          <p>{{ product.descripcion }}</p>
          <p>Stock: {{ product.stock }}</p>
          <button class="button is-primary mt-3">Agregar al carrito</button>
        </div>
      </div>
    </div>
  </section>
</template>