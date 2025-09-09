<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LogIn, Mail, Lock } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const router = useRouter()
const route = useRoute()

// Mostrar mensaje si viene de redirección
onMounted(() => {
  const message = route.query.message
  if (message) {
    Swal.fire({
      icon: 'info',
      title: 'Acceso requerido',
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#667eea'
    })
  }
})

const login = async () => {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })

    // Guardar token en localStorage
    localStorage.setItem('token', res.token)
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Login exitoso'
    })
    
    // Redirigir a la página solicitada o a la página principal
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.statusMessage || 'Error en login'
    })
  }
}
</script>
<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half-desktop is-two-thirds-tablet">
          <div class="box">
            <div class="has-text-centered mb-5">
              <h1 class="title text-gradient">
                <LogIn :size="24" class="mr-3" />
                Iniciar Sesión
              </h1>
              <p class="subtitle is-6 has-text-grey">Accede a tu cuenta</p>
            </div>
            
            <form @submit.prevent="login">
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input 
                    v-model="email" 
                    class="input" 
                    type="email" 
                    placeholder="tu@email.com" 
                    required
                  />
                  <span class="icon is-small is-left">
                    <Mail :size="16" />
                  </span>
                </div>
              </div>

              <div class="field">
                <label class="label">Contraseña</label>
                <div class="control has-icons-left">
                  <input 
                    v-model="password" 
                    class="input" 
                    type="password" 
                    placeholder="Tu contraseña" 
                    required
                  />
                  <span class="icon is-small is-left">
                    <Lock :size="16" />
                  </span>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button 
                    type="submit" 
                    class="button is-fullwidth"
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;"
                  >
                    <LogIn :size="18" class="mr-2" />
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </form>

            <div class="has-text-centered mt-4">
              <p class="is-size-7 has-text-grey">
                ¿No tienes cuenta? 
                <NuxtLink to="/register" class="has-text-weight-semibold" style="color: #667eea;">
                  Regístrate aquí
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>