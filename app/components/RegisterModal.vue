<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  isActive: { type: Boolean, default: false }
})
const emit = defineEmits(['update:isActive'])

const email = ref('')
const password = ref('')
const name = ref('')
const telefono = ref('')

const handleRegister =async () => {
try {
    const res= await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value, name:name.value, telefono:telefono.value}
    })

    if (res.message) {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: res.message
      })
    }
    emit('update:isActive', false)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.statusMessage || 'Error en registro'
    })
  }
  
}

watch(() => props.isActive, active => {
  if (!active) {
    email.value = ''
    password.value = ''
  }
})
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="emit('update:isActive', false)"></div>
    <div class="modal-card">
  <header class="modal-card-head" style="background: linear-gradient(135deg, var(--primary-600), var(--secondary-600));">
        <p class="modal-card-title has-text-white">Registrarse</p>
        <button class="delete" @click="emit('update:isActive', false)"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input" type="text" v-model="name" placeholder="Nombre">
          </div>
        </div>
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
        <div class="field">
          <label class="label">Teléfono</label>
          <div class="control">
            <input class="input" type="text" v-model="telefono" placeholder="Teléfono">
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="handleRegister" style="background: linear-gradient(135deg, var(--primary-600), var(--secondary-600)); color: white; border: none;">Registrarse</button>
        <button class="button" @click="emit('update:isActive', false)">Cancelar</button>
      </footer>
    </div>
  </div>
</template>