<script setup>
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  isActive: { type: Boolean, default: false }
})
const emit = defineEmits(['update:isActive'])

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const telefono = ref('')
const errors = ref({})

const validateForm = () => {
  errors.value = {}
  
  if (!name.value.trim()) {
    errors.value.name = 'El nombre es requerido'
  }
  
  if (!email.value.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'El email no es válido'
  }
  
  if (!telefono.value.trim()) {
    errors.value.telefono = 'El teléfono es requerido'
  } else if (!/^[0-9+\-\s()]+$/.test(telefono.value)) {
    errors.value.telefono = 'El teléfono no es válido'
  }
  
  if (!password.value) {
    errors.value.password = 'La contraseña es requerida'
  } else if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Confirma tu contraseña'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    const res = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { 
        email: email.value, 
        password: password.value, 
        name: name.value, 
        telefono: telefono.value
      }
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
    confirmPassword.value = ''
    name.value = ''
    telefono.value = ''
    errors.value = {}
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
          <label class="label">Nombre *</label>
          <div class="control">
            <input 
              class="input" 
              :class="{ 'is-error': errors.name }"
              type="text" 
              v-model="name" 
              placeholder="Nombre completo"
            >
          </div>
          <p v-if="errors.name" class="help is-error">{{ errors.name }}</p>
        </div>
        
        <div class="field">
          <label class="label">Email *</label>
          <div class="control">
            <input 
              class="input" 
              :class="{ 'is-error': errors.email }"
              type="email" 
              v-model="email" 
              placeholder="Email"
            >
          </div>
          <p v-if="errors.email" class="help is-error">{{ errors.email }}</p>
        </div>
        
        <div class="field">
          <label class="label">Teléfono *</label>
          <div class="control">
            <input 
              class="input" 
              :class="{ 'is-error': errors.telefono }"
              type="tel" 
              v-model="telefono" 
              placeholder="Teléfono"
            >
          </div>
          <p v-if="errors.telefono" class="help is-error">{{ errors.telefono }}</p>
        </div>
        
        <div class="field">
          <label class="label">Contraseña *</label>
          <div class="control">
            <input 
              class="input" 
              :class="{ 'is-error': errors.password }"
              type="password" 
              v-model="password" 
              placeholder="Contraseña"
            >
          </div>
          <p v-if="errors.password" class="help is-error">{{ errors.password }}</p>
        </div>
        
        <div class="field">
          <label class="label">Confirmar contraseña *</label>
          <div class="control">
            <input 
              class="input" 
              :class="{ 'is-error': errors.confirmPassword }"
              type="password" 
              v-model="confirmPassword" 
              placeholder="Repite tu contraseña"
            >
          </div>
          <p v-if="errors.confirmPassword" class="help is-error">{{ errors.confirmPassword }}</p>
        </div>
        
        <div class="field">
          <p class="help is-info">
            <strong>*</strong> Campos obligatorios
          </p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="handleRegister" style="background: linear-gradient(135deg, var(--primary-600), var(--secondary-600)); color: white; border: none;">Registrarse</button>
        <button class="button" @click="emit('update:isActive', false)">Cancelar</button>
      </footer>
    </div>
  </div>
</template>