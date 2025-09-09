<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '~/composables/useCart'
import { ArrowLeft, Minus, Plus, ShoppingCart, X } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const route = useRoute()
const product = ref(null)
const quantity = ref(1)
const showImageModal = ref(false)
const { addToCart, setUserFromStorage, fetchCart } = useCart()

const fetchProduct = async () => {
  try {
    product.value = await $fetch(`/api/products/${route.params.id}`)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al cargar el producto'
    })
  }
}

const increment = () => { quantity.value = Math.min(quantity.value + 1, 99) }
const decrement = () => { quantity.value = Math.max(quantity.value - 1, 1) }
const addCurrentToCart = async () => {
  if (!product.value?._id) return
  await addToCart(product.value._id, quantity.value)
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

onMounted(() => {
  setUserFromStorage()
  fetchCart()
  fetchProduct()
})
</script>

<template>
  <section class="section" v-if="product">
    <div class="container">
      <!-- Seguir comprando: top-left en desktop, centrado en mobile -->
      <div class="is-hidden-mobile mb-4">
        <NuxtLink to="/" class="button is-light is-rounded" style="margin: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
          <ArrowLeft :size="18" class="mr-2" />
          Seguir comprando
        </NuxtLink>
      </div>
      <div class="is-hidden-tablet has-text-centered mb-4">
        <NuxtLink to="/" class="button is-light is-rounded" style="margin: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
          <ArrowLeft :size="18" class="mr-2" />
          Seguir comprando
        </NuxtLink>
      </div>
      <div class="columns is-variable is-6 is-multiline">
        <!-- Imagen -->
        <div class="column is-full-mobile is-half-desktop">
          <div class="box p-0" style="overflow:hidden; border-radius: 12px; cursor: pointer;" @click="openImageModal">
            <figure class="image is-square">
              <img :src="product.imagen" :alt="product.nombre" loading="lazy" style="object-fit: cover; width: 100%; height: 100%; transition: transform 0.3s ease;" />
            </figure>
            <div class="has-text-centered mt-2">
              <small class="has-text-grey">Click para ampliar</small>
            </div>
          </div>
        </div>

        <!-- Detalles y compra -->
        <div class="column is-full-mobile is-half-desktop">
          <div class="content has-text-centered">
            <h1 class="title is-size-4-mobile is-size-2-desktop">{{ product.nombre }}</h1>
            <p class="is-size-6 has-text-grey" v-if="product.categoria">Categoría: {{ product.categoria }}</p>
            <h2 class="title is-size-4-mobile is-size-3-desktop" style="color: #e74c3c; font-weight: bold;">$ {{ product.precio }}</h2>
            <p class="is-size-6">{{ product.descripcion }}</p>

            <!-- Selector cantidad -->
            <div class="field has-addons mt-4" style="max-width: 220px; margin: 0 auto;">
              <p class="control">
                <button class="button" @click="decrement" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                  <Minus :size="16" />
                </button>
              </p>
              <p class="control is-expanded">
                <input class="input has-text-centered" type="number" min="1" max="99" v-model.number="quantity">
              </p>
              <p class="control">
                <button class="button" @click="increment" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                  <Plus :size="16" />
                </button>
              </p>
            </div>

            <p class="mt-3" :class="{ 'has-text-success': product.stock > 0, 'has-text-danger': product.stock <= 0 }">
              {{ product.stock > 0 ? 'En stock' : 'Sin stock' }}
            </p>

            <div class="is-flex is-flex-wrap-wrap is-justify-content-center mt-3" style="gap: 0.75rem;">
              <button class="button is-medium" @click="addCurrentToCart" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                <ShoppingCart :size="18" class="mr-2" />
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para imagen ampliada -->
    <div class="modal" :class="{ 'is-active': showImageModal }">
      <div class="modal-background" @click="closeImageModal"></div>
      <div class="modal-content" style="max-width: 90vw; max-height: 90vh; display: flex; align-items: center; justify-content: center;">
        <div class="box p-0" style="max-width: 100%; max-height: 100%; overflow: hidden; border-radius: 12px;">
          <figure class="image">
            <img :src="product.imagen" :alt="product.nombre" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </figure>
        </div>
      </div>
      <button class="modal-close is-large" @click="closeImageModal">
        <X :size="24" />
      </button>
    </div>
  </section>
</template>