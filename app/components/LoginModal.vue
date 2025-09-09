<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const props = defineProps({
  isActive: { type: Boolean, default: false }
})
const emit = defineEmits(['update:isActive', 'login'])

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    // Guardar token en localStorage
      const userData = {
      id: res.id,
      token: res.token,
      role: res.role 
    }
    localStorage.setItem('user', JSON.stringify(userData))
    // Emitir login con info del usuario
    emit('login', res.user)

    // Cerrar modal
    emit('update:isActive', false)

    location.reload()
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.statusMessage || 'Error en login'
    })
  }
}

// Resetear campos al cerrar modal
watch(() => props.isActive, active => {
  if (!active) {
    email.value = ''
    password.value = ''
  }
})


</script>

<template>
  <div  class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="emit('update:isActive', false)"></div>
    <div class="modal-card">
      <header class="modal-card-head" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <p class="modal-card-title has-text-white">Iniciar Sesión</p>
        <button class="delete" @click="emit('update:isActive', false)"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" v-model="email" placeholder="Email">
          </div>
        </div>
        <div class="field">
          <label class="label">Contraseña</label>
          <div class="control">
            <input class="input" type="password" v-model="password" placeholder="Contraseña">
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="handleLogin" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">Ingresar</button>
        <button class="button" @click="emit('update:isActive', false)">Cancelar</button>
      </footer>
    </div>
  </div>
</template>