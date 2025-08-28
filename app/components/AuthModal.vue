<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow w-96">
      <h2 class="text-xl font-bold mb-4">{{ isLogin ? 'Login' : 'Registro' }}</h2>
      <form @submit.prevent="submit">
        <input v-model="email" type="email" placeholder="Email" class="input mb-2 w-full" required />
        <input v-model="password" type="password" placeholder="Contraseña" class="input mb-2 w-full" required />
        <input v-if="!isLogin" v-model="name" type="text" placeholder="Nombre" class="input mb-2 w-full" />
        <button type="submit" class="btn w-full">{{ isLogin ? 'Ingresar' : 'Registrarse' }}</button>
      </form>
      <p class="mt-4 text-center text-sm">
        <span @click="toggleMode" class="text-blue-500 cursor-pointer">
          {{ isLogin ? 'Crear una cuenta' : 'Ya tengo cuenta' }}
        </span>
      </p>
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close'])

const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')

const { login, register, fetchMe } = useAuth()

function toggleMode() {
  isLogin.value = !isLogin.value
}

async function submit() {
  try {
    if (isLogin.value) {
      await login(email.value, password.value)
    } else {
      await register(name.value, email.value, password.value)
    }
    await fetchMe()
    emit('close')
  } catch (e) {
    alert(e.message || 'Error al autenticarse')
  }
}
</script>