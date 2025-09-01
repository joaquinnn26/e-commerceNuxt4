<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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
    localStorage.setItem('token', res.token)
        localStorage.setItem('user', res.id)
    // Emitir login con info del usuario
    emit('login', res.user)

    // Cerrar modal
    emit('update:isActive', false)

    location.reload()
  } catch (err) {
    alert(err.statusMessage || 'Error en login')
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
      <header class="modal-card-head">
        <p class="modal-card-title">Iniciar Sesión</p>
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
        <button class="button is-success" @click="handleLogin">Ingresar</button>
        <button class="button" @click="emit('update:isActive', false)">Cancelar</button>
      </footer>
    </div>
  </div>
</template>