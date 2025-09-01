
<script setup>
import { ref, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const showLogin = ref(false)
const showRegister = ref(false)
const isLoggedIn = ref(false)
const showCart = ref(false)


const { cart, setUserFromStorage, fetchCart, addToCart, removeFromCart } = useCart()


const toggleCart = () => {
  showCart.value = !showCart.value
}

onMounted(() => {
  setUserFromStorage()
  fetchCart()
  const token = localStorage.getItem('user')
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    setUserFromStorage()  // carga userId desde localStorage
    fetchCart()            // trae el carrito del backend
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
  localStorage.removeItem('user')
  isLoggedIn.value = false
  location.reload()
}
</script>

<template>
  <nav class="navbar is-primary">
    <div class="navbar-brand">
      <NuxtLink class="navbar-item" to="/">MiTienda</NuxtLink>
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
