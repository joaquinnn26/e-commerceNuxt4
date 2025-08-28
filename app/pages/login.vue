<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    // Guardar token en localStorage
    localStorage.setItem('token', res.token)
    alert('Login exitoso')
    router.push('/dashboard')
  } catch (err) {
    alert(err.statusMessage || 'Error en login')
  }
}
</script>
<template>
  <form @submit.prevent="login">
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button type="submit">Ingresar</button>
  </form>
</template>