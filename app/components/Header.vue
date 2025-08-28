<script setup>
import { ref, computed } from 'vue'
const showLogin = ref(false)
const showRegister = ref(false)


const isLoggedIn = ref(false)

onMounted(() => {
  const token = localStorage.getItem('user')
  isLoggedIn.value = !!token
})

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
            <NuxtLink class="button is-light" to="/cart">Carrito</NuxtLink>
            <button class="button is-light" @click="logout">Cerrar Sesión</button>
          </template>
        </div>
      </div>
    </div>

    <LoginModal v-model:is-active="showLogin"  />
    <RegisterModal v-model:is-active="showRegister" />
  </nav>
</template>