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

// Nuevo carrusel simple
const currentSlideIndex = ref(0)
const slideWidth = ref(100) // Porcentaje de ancho por slide
const productsPerSlide = ref(1) // Productos por slide

// Computed para crear slides con múltiples productos
const slides = computed(() => {
  if (featuredProducts.value.length === 0) return []
  
  const result = []
  for (let i = 0; i < featuredProducts.value.length; i += productsPerSlide.value) {
    result.push(featuredProducts.value.slice(i, i + productsPerSlide.value))
  }
  return result
})

// Función para actualizar productos por slide según el tamaño de pantalla
const updateProductsPerSlide = () => {
  if (window.innerWidth >= 1200) {
    productsPerSlide.value = 3
    slideWidth.value = 33.333
  } else if (window.innerWidth >= 1024) {
    productsPerSlide.value = 2
    slideWidth.value = 50
  } else {
    productsPerSlide.value = 1
    slideWidth.value = 100
  }
}

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
    totalPages.value = Number(res.pagination.totalPages)
    currentPage.value = Number(res.pagination.currentPage)
    noResults.value = res.data.length === 0
  } catch (err) {
    products.value = []
    noResults.value = true
  }
}

const fetchFeaturedProducts = async () => {
  try {
    const res = await $fetch('/api/products/featured')
    featuredProducts.value = res
  } catch (err) {
    featuredProducts.value = []
  }
}

// Controles del nuevo carrusel
const nextSlide = () => {
  if (currentSlideIndex.value < slides.value.length - 1) {
    currentSlideIndex.value++
  } else {
    currentSlideIndex.value = 0
  }
}

const prevSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  } else {
    currentSlideIndex.value = slides.value.length - 1
  }
}

const goToSlide = (index) => {
  currentSlideIndex.value = index
}

// Auto-play del carrusel
let carouselInterval = null

const startCarousel = () => {
  if (slides.value.length > 1) {
    carouselInterval = setInterval(() => {
      nextSlide()
    }, 4000) // Cambia cada 4 segundos
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
  updateProductsPerSlide()
  currentSlideIndex.value = 0
  startCarousel()
  
  // Listener para cambios de tamaño de pantalla
  window.addEventListener('resize', updateProductsPerSlide)
})

onUnmounted(() => {
  stopCarousel()
  window.removeEventListener('resize', updateProductsPerSlide)
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

    <!-- Productos Destacados - Nuevo Carrusel -->
    <section class="section featured-section">
      <div class="container">
        <div class="has-text-centered mb-6">
          <h2 class="title is-size-4-mobile is-size-3-tablet text-gradient">Productos Destacados</h2>
          <p class="subtitle is-5 has-text-grey">Descubre lo mejor de la semana</p>
        </div>

        <div v-if="featuredProducts.length === 0" class="notification is-info has-text-centered">
          <p>¡Pronto tendremos productos especiales para ti! Mantente atento a nuestras novedades.</p>
        </div>

        <div v-else class="new-carousel">
          <div class="carousel-container">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlideIndex * slideWidth}%)` }">
              <div 
                class="carousel-slide" 
                v-for="(slideProducts, slideIndex) in slides" 
                :key="slideIndex"
              >
                <div class="products-grid">
                  <div 
                    class="product-card" 
                    v-for="product in slideProducts" 
                    :key="product._id"
                  >
                    <div class="product-image">
                      <img :src="product.imagen" :alt="product.nombre" loading="lazy" />
                      <span class="product-badge">Destacado</span>
                      <span v-if="product.stock === 0" class="tag is-danger stock-badge">Sin stock</span>
                    </div>
                    <div class="product-info">
                      <h3 class="product-title">{{ product.nombre }}</h3>
                      <p class="product-price">${{ product.precio }}</p>
                      <p class="product-description">{{ product.descripcion.substring(0, 80) }}...</p>
                      <div class="product-actions">
                        <NuxtLink :to="`/product/${product._id}`" class="btn-view-carousel">
                          <Eye :size="16" />
                          Ver detalles
                        </NuxtLink>
                        <button 
                          class="btn-cart-carousel"
                          :disabled="product.stock === 0"
                          @click="product.stock === 0 ? null : addToCart(product._id)"
                        >
                          <ShoppingCart :size="16" />
                          {{ product.stock === 0 ? 'Sin stock' : 'Agregar' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Controles de navegación -->
          <button 
            class="carousel-btn prev-btn" 
            @click="prevSlide" 
            v-if="slides.length > 1"
          >
            <ChevronLeft :size="20" />
          </button>
          <button 
            class="carousel-btn next-btn" 
            @click="nextSlide" 
            v-if="slides.length > 1"
          >
            <ChevronRight :size="20" />
          </button>

          <!-- Indicadores -->
          <div class="carousel-indicators" v-if="slides.length > 1">
            <button 
              v-for="(slide, index) in slides" 
              :key="index" 
              class="carousel-indicator" 
              :class="{ 'is-active': currentSlideIndex === index }" 
              @click="goToSlide(index)"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Productos Simplificada -->
    <section class="products-section-simple">
      <div class="container">
        <!-- Header simple -->
        <div class="products-header-simple">
          <h2 class="section-title-simple">Nuestros Productos</h2>
          <p class="section-subtitle-simple">Los mejores productos al mejor precio</p>
        </div>

        <!-- Barra de búsqueda simple -->
        <div class="search-section-simple">
          <div class="search-container-simple">
            <div class="search-input-wrapper-simple">
              <Search :size="20" class="search-icon-simple" />
              <input 
                class="search-input-simple" 
                type="text" 
                placeholder="Buscar productos..." 
                v-model="searchTerm"
              />
            </div>
            <div class="category-select-simple">
              <select v-model="selectedCategory" class="category-select">
                <option value="">Todas las categorías</option>
                <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Mensaje si no hay resultados -->
        <div v-if="noResults" class="no-results-simple">
          <Search :size="32" class="no-results-icon-simple" />
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros términos de búsqueda</p>
        </div>

        <!-- Grid de productos simple -->
        <div v-else class="products-grid-simple">
          <div 
            v-for="product in products" 
            :key="product._id" 
            class="product-card-simple"
          >
            <!-- Imagen del producto -->
            <div class="product-image-simple">
              <img :src="product.imagen" :alt="product.nombre" loading="lazy" />
              <div class="product-badge-simple" v-if="product.stock === 0">Sin stock</div>
            </div>

            <!-- Información del producto -->
            <div class="product-info-simple">
              <h3 class="product-title-simple">{{ product.nombre }}</h3>
              <p class="product-price-simple">${{ product.precio }}</p>
              <p class="product-description-simple">{{ product.descripcion.substring(0, 80) }}...</p>
              
              <div class="product-actions-simple">
                <NuxtLink :to="`/product/${product._id}`" class="btn-view-simple">
                  <Eye :size="16" />
                  Ver detalles
                </NuxtLink>
                <button 
                  class="btn-cart-simple"
                  :disabled="product.stock === 0"
                  @click="addToCart(product._id)"
                >
                  <ShoppingCart :size="16" />
                  {{ product.stock === 0 ? 'Sin stock' : 'Agregar' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación simple -->
        <div v-if="!noResults && totalPages > 1" class="pagination-simple">
          <button 
            class="pagination-btn-simple prev"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeft :size="16" />
            Anterior
          </button>
          
          <div class="pagination-numbers-simple">
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="pagination-number-simple"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-btn-simple next"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Siguiente
            <ChevronRight :size="16" />
          </button>
        </div>
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
