<script setup>
import { ref, onMounted } from 'vue'
import { useCart } from '~/composables/useCart.js'

const showLogin = ref(false)
const showRegister = ref(false)
const isLoggedIn = ref(false)
const isAdmin = ref(false) 
const showCart = ref(false)

const categories = ref([
  { name: 'Electrónica', slug: 'electronica' },
  { name: 'Ropa', slug: 'ropa' },
  { name: 'Hogar', slug: 'hogar' }
])

const { cart, setUserFromStorage, fetchCart, addToCart, removeFromCart } = useCart()

const toggleCart = () => {
  showCart.value = !showCart.value
}

onMounted(() => {
  setUserFromStorage()
  fetchCart()
  let userData = null
try {
  const storedUser = localStorage.getItem('user')
  userData = storedUser ? JSON.parse(storedUser) : null
} catch (error) {
  console.error('Error al parsear el usuario desde localStorage', error)
}

 if (userData) {
    isLoggedIn.value = true          
    setUserFromStorage()             
    fetchCart()                      
  }

  if (userData?.role === 'admin') {
    isAdmin.value = true
  }

  if (isLoggedIn.value) {
    setUserFromStorage()
    fetchCart()
  }
})

const handleCheckout = () => {
  showCart.value = false
  window.location.href = '/checkout'
}

const handleCartUpdate = async (action) => {
  if (action.type === 'increment') await addToCart(action.productId, 1)
  if (action.type === 'decrement') await addToCart(action.productId, -1)
  if (action.type === 'remove') await removeFromCart(action.productId)
}

const logout = () => {
  localStorage.removeItem('user','token')
  isLoggedIn.value = false
  isAdmin.value = false
  location.reload()
}
</script>

<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <NuxtLink class="navbar-item" to="/">MiTienda</NuxtLink>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">
        <!-- Menú desplegable de categorías -->
        <div v-if="!isAdmin" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">Categorías</a>
          <div class="navbar-dropdown">
            <NuxtLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="`/categoria/${cat.slug}`"
              class="navbar-item"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
        </div>


        <div v-if="isAdmin" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">Panel Administrador</a>
          <div class="navbar-dropdown">
            <NuxtLink to="/admin/createProduct" class="navbar-item">Gestionar productos</NuxtLink>
            <NuxtLink to="/admin/orders" class="navbar-item">Ver órdenes de compra</NuxtLink>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="!isLoggedIn">
              <button class="button is-light" @click="showLogin = true">Iniciar Sesión</button>
              <button class="button is-light" @click="showRegister = true">Registrarse</button>
            </template>
            <template v-else>
              <button class="button is-light" @click="toggleCart">
                Carrito ({{ cart.length }})
              </button>
              <button class="button is-light" @click="logout">Cerrar Sesión</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <CartModal
      :is-active="showCart"
      :cart="cart"
      @close="showCart = false"
      @update:cart="handleCartUpdate"
      @checkout="handleCheckout"
    />
    <LoginModal v-model:is-active="showLogin" />
    <RegisterModal v-model:is-active="showRegister" />
  </nav>
</template>