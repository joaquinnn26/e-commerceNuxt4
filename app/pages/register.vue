<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')


const register = async () => {
  try {
    const res = await $fetch('/api/users/create', {
      method: 'POST',
      body: { name: name.value,
  email: email.value,
  password: password.value }
    })
    alert(res.message)
    router.push('/login')
  } catch (err) {
    alert(err.statusMessage || 'Error al registrar usuario')
  }
}
</script>

<template>
    <NuxtLayout/>
  <div>
    <h1>Registro</h1>
    <input v-model="name" placeholder="Nombre">
    <input v-model="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Contraseña">
    <button @click="register">Registrar</button>
    <p>¿Ya tenés cuenta? <NuxtLink to="/login">Login</NuxtLink></p>
  </div>
</template>