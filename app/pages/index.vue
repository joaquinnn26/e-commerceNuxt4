<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCart } from '~/composables/useCart'
import { Store, Search, Eye, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-vue-next'

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
      <div class="has-text-centered mb-6">
        <h1 class="title is-size-4-mobile is-size-2-tablet text-gradient">
          <Store :size="24" class="mr-3" />
          Nuestra Tienda
        </h1>
        <p class="subtitle is-5 has-text-grey">Descubre productos increíbles a precios increíbles</p>
      </div>

      <!-- Barra de búsqueda y filtro de categoría -->
      <div class="field is-grouped is-grouped-multiline mb-4 is-flex-direction-column-mobile">
        <div class="control is-expanded mb-2-mobile">
          <div class="field has-addons">
            <div class="control is-expanded">
              <input 
                class="input is-fullwidth" 
                type="text" 
                placeholder="Buscar productos por nombre..." 
                v-model="searchTerm"
              />
            </div>
            <div class="control">
              <button class="button is-static">
                <Search :size="18" />
              </button>
            </div>
          </div>
        </div>
        <div class="control is-fullwidth-mobile">
          <div class="select is-fullwidth">
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
      <div v-if="noResults" class="notification is-warning is-size-6-mobile">
        <Search :size="18" class="mr-2" />
        No se encontraron productos con esos criterios.
      </div>

      <!-- Productos -->
      <div class="columns is-multiline is-variable is-2 is-centered is-flex is-justify-content-center"  v-else>
        <div class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop" v-for="prod in products" :key="prod._id">
          <div class="card is-fullheight">
            <div class="card-image">
              <figure class="image is-4by3" style="overflow:hidden;">
                <img :src="prod.imagen" :alt="prod.nombre" loading="lazy" style="object-fit: cover; width: 100%; height: 100%;" />
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-6-mobile is-5-tablet">{{ prod.nombre  }}</p>
              <p class="subtitle is-7-mobile is-6-tablet">$ {{ prod.precio }}</p>
              <p class="is-size-7-mobile">{{ prod.descripcion.substring(0, 80) }}...</p>
            </div>
            <footer class="card-footer is-flex-wrap-wrap">
              <NuxtLink 
                :to="`/product/${prod._id}`" 
                class="card-footer-item is-size-7-mobile is-flex-grow-1"
              >
                <Eye :size="16" class="mr-1" />
                Ver detalles
              </NuxtLink>
              <a 
                class="card-footer-item is-size-7-mobile is-flex-grow-1" 
                @click.prevent="addToCart(prod._id)"
              >
                <ShoppingCart :size="16" class="mr-1" />
                Agregar al carrito
              </a>
            </footer>
          </div>
        </div>
      </div>

      <!-- Paginación Bulma responsive -->
      <nav class="pagination is-centered mt-5 is-flex-wrap-wrap" role="navigation" aria-label="pagination" v-if="!noResults && totalPages > 1">
        <a 
          class="pagination-previous mb-2-mobile" 
          @click.prevent="goToPage(currentPage - 1)"
        >
          <ChevronLeft :size="16" class="mr-1" />
          Anterior
        </a>
        <a 
          class="pagination-next mb-2-mobile" 
          @click.prevent="goToPage(currentPage + 1)"
        >
          Siguiente
          <ChevronRight :size="16" class="ml-1" />
        </a>

        <ul class="pagination-list is-flex-wrap-wrap">
          <li v-for="page in totalPages" :key="page">
            <a 
              class="pagination-link mb-1-mobile" 
              :class="{ 'is-current': page === currentPage }" 
              @click.prevent="goToPage(page)"
            >{{ page }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>
