<script setup>
import { ref, onMounted } from 'vue'
import { useCart } from '~/composables/useCart.js'
import { Store, LogIn, UserPlus, Settings, LogOut, ShoppingCart, PlusCircle, ShoppingBag, ChevronDown } from 'lucide-vue-next'
import Swal from 'sweetalert2'

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
  if (!isLoggedIn.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para ver tu carrito de compras',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#667eea'
    })
    return
  }
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
const showAdminMenu=ref(false)
const showAdminMenuMobile=ref(false)
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
<nav class="navbar px-4 py-3" role="navigation" aria-label="main navigation" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div class="is-flex is-justify-content-space-between is-align-items-center" style="width: 100%;">
    <!-- Izquierda: nombre tienda -->
    <NuxtLink to="/" class="navbar-item p-0">
      <span class="has-text-weight-bold is-size-5 has-text-white">
        <Store :size="20" class="mr-2" />
        MiTienda
      </span>
    </NuxtLink>

    <!-- Derecha desktop: acciones inline -->
    <div class="is-hidden-touch is-flex is-align-items-center" style="gap: 0.5rem;">
      <template v-if="!isLoggedIn">
        <button class="button is-light is-rounded is-medium" @click="showLogin = true">
          <LogIn :size="18" class="mr-2" />
          Iniciar Sesión
        </button>
        <button class="button is-light is-rounded is-medium" @click="showRegister = true">
          <UserPlus :size="18" class="mr-2" />
          Registrarse
        </button>
      </template>
      <template v-else>
        <template v-if="isAdmin">
          <div class="dropdown is-right" :class="{ 'is-active': showAdminMenu }">
            <div class="dropdown-trigger">
              <button class="button is-link is-light is-medium" aria-haspopup="true" aria-controls="admin-menu" @click="showAdminMenu = !showAdminMenu">
                <Settings :size="18" class="mr-2" />
                <span>Panel</span>
                <ChevronDown :size="16" class="ml-2" />
              </button>
            </div>
            <div class="dropdown-menu" id="admin-menu" role="menu">
              <div class="dropdown-content">
                <NuxtLink to="/admin/createProduct" class="dropdown-item" @click="showAdminMenu = false">
                  <PlusCircle :size="16" class="mr-2" />
                  Crear producto
                </NuxtLink>
                <NuxtLink to="/admin/orders" class="dropdown-item" @click="showAdminMenu = false">
                  <ShoppingBag :size="16" class="mr-2" />
                  Órdenes de compra
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
        <button class="button is-danger is-rounded has-text-white is-medium" @click="logout">
          <LogOut :size="18" class="mr-2" />
          Cerrar Sesión
        </button>
      </template>
    </div>

    <!-- Derecha mobile: acciones compactas (con texto pequeño) -->
    <div class="is-hidden-desktop is-flex is-align-items-center" style="gap: 0.25rem;">
      <template v-if="!isLoggedIn">
        <button class="button is-light is-rounded is-small" @click="showLogin = true">
          <LogIn :size="14" class="mr-1" />
          <span class="is-size-7">Login</span>
        </button>
        <button class="button is-light is-rounded is-small" @click="showRegister = true">
          <UserPlus :size="14" class="mr-1" />
          <span class="is-size-7">Registro</span>
        </button>
      </template>
      <template v-else>
        <template v-if="isAdmin">
          <div class="dropdown is-right" :class="{ 'is-active': showAdminMenuMobile }">
            <div class="dropdown-trigger">
              <button class="button is-link is-light is-small" aria-haspopup="true" aria-controls="admin-menu-mobile" @click="showAdminMenuMobile = !showAdminMenuMobile">
                <Settings :size="14" class="mr-1" />
                <span class="is-size-7">Panel</span>
              </button>
            </div>
            <div class="dropdown-menu" id="admin-menu-mobile" role="menu">
              <div class="dropdown-content">
                <NuxtLink to="/admin/createProduct" class="dropdown-item" @click="showAdminMenuMobile = false">
                  <PlusCircle :size="16" class="mr-2" />
                  Crear producto
                </NuxtLink>
                <NuxtLink to="/admin/orders" class="dropdown-item" @click="showAdminMenuMobile = false">
                  <ShoppingBag :size="16" class="mr-2" />
                  Órdenes de compra
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
        <button class="button is-danger is-rounded has-text-white is-small" @click="logout">
          <LogOut :size="14" class="mr-1" />
          <span class="is-size-7">Salir</span>
        </button>
      </template>
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

<!-- Menú móvil eliminado: usamos botones compactos para estabilidad -->

<!-- Botón flotante de carrito solo en móvil -->
<button 
  class="button is-info has-text-white is-rounded"
  style="position: fixed; right: 16px; bottom: 16px; z-index: 50; height: 64px; min-width: 64px; border-radius: 9999px; box-shadow: 0 6px 18px rgba(0,0,0,0.25); display: inline-flex; align-items: center; justify-content: center; padding: 0 20px; font-size: 1.1rem;"
  @click="toggleCart"
>
  <ShoppingCart :size="20" class="mr-2" />
  ({{ cart.length }})
</button>
</template>