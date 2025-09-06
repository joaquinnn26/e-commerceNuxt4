<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCart } from '~/composables/useCart'

const products = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 8
const searchTerm = ref('')
const selectedCategory = ref('') // Categoría seleccionada
const noResults = ref(false) // Para mostrar mensaje de "no hay resultados"

const { addToCart, setUserFromStorage, fetchCart } = useCart()

const categories = ref([
  { name: 'Electrónica', slug: 'electronica' },
  { name: 'Ropa', slug: 'ropa' },
  { name: 'Hogar', slug: 'hogar' }
])

const fetchProducts = async (page = 1) => {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString(),
      search: searchTerm.value,
      category: selectedCategory.value
    })
    const res = await $fetch(`/api/products/paginated?${query}`)
    products.value = res.data
    totalPages.value = Number(res.totalPages)
    currentPage.value = Number(res.currentPage)

    // Si no hay productos, activamos el mensaje
    noResults.value = res.data.length === 0
  } catch (err) {
    console.error('Error al cargar productos:', err)
    products.value = []
    noResults.value = true
  }
}

// Resetea la página a 1 cuando cambia la búsqueda o categoría
watch([searchTerm, selectedCategory], () => fetchProducts(1))

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchProducts(page)
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

      <!-- Barra de búsqueda y filtro de categoría -->
      <div class="field is-grouped mb-4">
        <div class="control is-expanded">
          <input 
            class="input" 
            type="text" 
            placeholder="Buscar productos por nombre..." 
            v-model="searchTerm"
          />
        </div>
        <div class="control">
          <div class="select">
            <select v-model="selectedCategory">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Mensaje si no hay resultados -->
      <div v-if="noResults" class="notification is-warning">
        No se encontraron productos con esos criterios.
      </div>

      <!-- Productos -->
      <div class="columns is-multiline" v-else>
        <div class="column is-one-quarter" v-for="prod in products" :key="prod._id">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="prod.imagen" :alt="prod.nombre" />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-5">{{ prod.nombre }}</p>
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

      <!-- Paginación Bulma -->
      <nav class="pagination is-centered mt-5" role="navigation" aria-label="pagination" v-if="!noResults && totalPages > 1">
        <a 
          class="pagination-previous" 
          :disabled="currentPage === 1" 
          @click.prevent="goToPage(currentPage - 1)"
        >Anterior</a>
        <a 
          class="pagination-next" 
          :disabled="currentPage === totalPages" 
          @click.prevent="goToPage(currentPage + 1)"
        >Siguiente</a>

        <ul class="pagination-list">
          <li v-for="page in totalPages" :key="page">
            <a 
              class="pagination-link" 
              :class="{ 'is-current': page === currentPage }" 
              @click.prevent="goToPage(page)"
            >{{ page }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
