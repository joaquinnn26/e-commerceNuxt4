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
  const storedUser = localStorage.getItem('user')
  const userData = storedUser ? JSON.parse(storedUser) : null

  if (userData) {
    isLoggedIn.value = true          
    setUserFromStorage()             
    fetchCart()                      

    if (userData.role === 'admin') {
      isAdmin.value = true
    }
  }
})
const showMenu=ref(false)
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
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  isLoggedIn.value = false
  isAdmin.value = false
  location.reload()
}
</script>

<template>
<nav class="navbar is-primary px-4 py-3" role="navigation" aria-label="main navigation">
  <!-- IZQUIERDA: LOGO -->
  <div class="navbar-brand">
    <NuxtLink to="/" class="navbar-item">

      <span class="has-text-weight-bold is-size-5">MiTienda</span>
    </NuxtLink>

    <!-- Burger para móvil -->
    <a role="button" class="navbar-burger" :class="{ 'is-active': showMenu }" aria-label="menu" aria-expanded="false" @click="showMenu = !showMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <!-- CENTRO: Menú -->
  <div class="navbar-menu">
    <div class="navbar-start">
      <!-- Categorías para usuarios -->
      <div v-if="!isAdmin" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link has-text-white">Categorías</a>
        <div class="navbar-dropdown">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.slug"
            :to="`/categoria/${cat.slug}`"
            class="navbar-item"
          >{{ cat.name }}</NuxtLink>
        </div>
      </div>

      <!-- Panel admin -->
      <div v-if="isAdmin" class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link has-text-white">Panel Administrador</a>
        <div class="navbar-dropdown">
          <NuxtLink to="/admin/createProduct" class="navbar-item">Gestionar productos</NuxtLink>
          <NuxtLink to="/admin/orders" class="navbar-item">Ver órdenes de compra</NuxtLink>
        </div>
      </div>
    </div>

    <!-- DERECHA: botones -->
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
  <template v-if="!isLoggedIn">
    <button class="button is-light is-rounded" @click="showLogin = true">Iniciar Sesión</button>
    <button class="button is-light is-rounded" @click="showRegister = true">Registrarse</button>
  </template>
  <template v-else>
    <!-- Botón Carrito con emoji -->
    <button class="button is-info is-rounded has-text-white" @click="toggleCart">
      🛒 Carrito ({{ cart.length }})
    </button>

    <!-- Botón Cerrar sesión con emoji -->
    <button class="button is-danger is-rounded has-text-white" @click="logout">
      🔓 Cerrar Sesión
    </button>
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