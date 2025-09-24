<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import { Store, Search, Eye, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const products = ref([])
const featuredProducts = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 8
const searchTerm = ref('')
const selectedCategory = ref('')
const noResults = ref(false)
const currentSlide = ref(0)

const { addToCart, setUserFromStorage, fetchCart } = useCart()

const categories = ref([
  { name: 'Electrónica', slug: 'electronica' },
  { name: 'Ropa', slug: 'ropa' },
  { name: 'Hogar', slug: 'hogar' }
])

// Dividir productos destacados en chunks de 4 para el carrusel
const featuredProductsChunks = computed(() => {
  const chunks = []
  for (let i = 0; i < featuredProducts.value.length; i += 4) {
    chunks.push(featuredProducts.value.slice(i, i + 4))
  }
  console.log('Chunks del carrusel:', chunks.length, chunks)
  return chunks
})

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
    noResults.value = res.data.length === 0
  } catch (err) {
    console.error('Error al cargar productos:', err)
    products.value = []
    noResults.value = true
  }
}

const fetchFeaturedProducts = async () => {
  try {
    const res = await $fetch('/api/products/featured')
    featuredProducts.value = res
    console.log('Productos destacados cargados:', res.length, res)
  } catch (err) {
    console.error('Error al cargar productos destacados:', err)
    featuredProducts.value = []
  }
}

// Controles del carrusel
const nextSlide = () => {
  if (currentSlide.value < featuredProductsChunks.value.length - 1) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Auto-play del carrusel
let carouselInterval = null

const startCarousel = () => {
  if (featuredProductsChunks.value.length > 1) {
    carouselInterval = setInterval(() => {
      if (currentSlide.value === featuredProductsChunks.value.length - 1) {
        currentSlide.value = 0
      } else {
        currentSlide.value++
      }
    }, 5000) // Cambia cada 5 segundos
  }
}

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

watch([searchTerm, selectedCategory], () => fetchProducts(1))

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchProducts(page)
}

onMounted(async () => {
  setUserFromStorage()
  fetchCart()
  fetchProducts()
  await fetchFeaturedProducts()
  currentSlide.value = 0
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})

// Reiniciar autoplay cuando cambien los destacados (por ejemplo, después de cargarlos)
watch(featuredProductsChunks, (chunks) => {
  currentSlide.value = 0
  stopCarousel()
  if (chunks.length > 0) {
    startCarousel()
  }
})
</script>
<template>
  <div>
    <!-- Sección de Bienvenida -->
    <section class="section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="container">
        <div class="has-text-centered mb-6">
          <h1 class="title is-size-4-mobile is-size-2-tablet has-text-white">
            <Store :size="24" class="mr-3" />
            Bienvenido a MiTienda
          </h1>
          <p class="subtitle is-5 has-text-white-ter">Tu destino para encontrar los mejores productos al mejor precio</p>
        </div>
      </div>
    </section>

    <!-- Productos Destacados - Carrusel Renovado -->
    <section class="section fp-section">
      <div class="container">
        <div class="has-text-centered mb-6">
          <h2 class="title is-size-4-mobile is-size-3-tablet text-gradient">Productos Destacados</h2>
          <p class="subtitle is-5 has-text-grey">Descubre lo mejor de la semana</p>
        </div>

        <div v-if="featuredProducts.length === 0" class="notification is-info has-text-centered">
          <p>¡Pronto tendremos productos especiales para ti! Mantente atento a nuestras novedades.</p>
        </div>

        <div v-else class="fp-slider">
          <div class="fp-viewport">
            <div class="fp-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div class="fp-slide" v-for="(chunk, index) in featuredProductsChunks" :key="index">
                <div class="fp-grid">
                  <div class="fp-item" v-for="product in chunk" :key="product._id">
                    <div class="fp-card">
                      <div class="fp-img">
                        <img :src="product.imagen" :alt="product.nombre" loading="lazy" />
                        <span class="fp-badge">Destacado</span>
                        <span v-if="product.stock === 0" class="tag is-danger" style="position:absolute; top:10px; right:10px;">Sin stock</span>
                      </div>
                      <div class="fp-info">
                        <h3 class="fp-title">{{ product.nombre }}</h3>
                        <p class="fp-price">${{ product.precio }}</p>
                        <p class="fp-desc">{{ product.descripcion.substring(0, 54) }}...</p>
                        <div class="fp-actions">
                          <NuxtLink :to="`/product/${product._id}`" class="button is-light is-small">Ver</NuxtLink>
                          <button 
                            class="button is-primary is-small" 
                            :disabled="product.stock === 0"
                            @click="product.stock === 0 ? null : addToCart(product._id)"
                          >{{ product.stock === 0 ? 'Sin stock' : 'Añadir' }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="fp-nav fp-prev" @click="prevSlide" :disabled="currentSlide === 0" v-if="featuredProductsChunks.length > 1">
            <ChevronLeft :size="20" />
          </button>
          <button class="fp-nav fp-next" @click="nextSlide" :disabled="currentSlide === featuredProductsChunks.length - 1" v-if="featuredProductsChunks.length > 1">
            <ChevronRight :size="20" />
          </button>

          <div class="fp-dots" v-if="featuredProductsChunks.length > 1">
            <button v-for="(chunk, index) in featuredProductsChunks" :key="index" class="fp-dot" :class="{ 'is-active': currentSlide === index }" @click="goToSlide(index)"></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Productos con Búsqueda -->
    <section class="section" style="background-color: #f8f9fa;">
      <div class="container">
        <div class="has-text-centered mb-6">
          <h2 class="title is-size-4-mobile is-size-3-tablet text-gradient">
            Nuestros Productos
          </h2>
          <p class="subtitle is-5 has-text-grey">Los mejores productos al mejor precio</p>
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
        <div class="columns is-multiline is-variable is-2 is-centered is-flex is-justify-content-center" v-else>
          <div class="column is-half-mobile is-one-third-tablet is-one-quarter-desktop" v-for="prod in products" :key="prod._id">
            <div class="card is-fullheight">
              <div class="card-image">
                <figure class="image is-4by3" style="overflow:hidden;">
                  <img :src="prod.imagen" :alt="prod.nombre" loading="lazy" style="object-fit: cover; width: 100%; height: 100%;" />
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-6-mobile is-5-tablet">{{ prod.nombre }}</p>
                <p class="subtitle is-7-mobile is-6-tablet has-text-primary">$ {{ prod.precio }}</p>
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

    <!-- Sección de Información -->
    <section class="section">
      <div class="container">
        <div class="has-text-centered mb-6">
          <h2 class="title is-size-4-mobile is-size-3-tablet text-gradient">
            ¿Por qué elegir MiTienda?
          </h2>
        </div>

        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="card has-text-centered">
              <div class="card-content">
                <div class="is-size-1 mb-4">🚚</div>
                <h3 class="title is-5 mb-3">Envío Gratis</h3>
                <p class="has-text-grey is-size-7">En compras superiores a $50.000</p>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="card has-text-centered">
              <div class="card-content">
                <div class="is-size-1 mb-4">🛡️</div>
                <h3 class="title is-5 mb-3">Garantía Total</h3>
                <p class="has-text-grey is-size-7">Todos nuestros productos tienen garantía</p>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <div class="card has-text-centered">
              <div class="card-content">
                <div class="is-size-1 mb-4">💬</div>
                <h3 class="title is-5 mb-3">Soporte 24/7</h3>
                <p class="has-text-grey is-size-7">Atención al cliente siempre disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
