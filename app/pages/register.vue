<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserPlus, User, Mail, Lock } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const register = async () => {
  try {
    const res = await $fetch('/api/users/create', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value }
    })
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: res.message
    })
    router.push('/login')
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.statusMessage || 'Error al registrar usuario'
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
                <UserPlus :size="24" class="mr-3" />
                Registro
              </h1>
              <p class="subtitle is-6 has-text-grey">Crea tu cuenta</p>
            </div>
            
            <form @submit.prevent="register">
              <div class="field">
                <label class="label">Nombre</label>
                <div class="control has-icons-left">
                  <input 
                    v-model="name" 
                    class="input" 
                    type="text" 
                    placeholder="Tu nombre completo" 
                    required
                  />
                  <span class="icon is-small is-left">
                    <User :size="16" />
                  </span>
                </div>
              </div>

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
                    <UserPlus :size="18" class="mr-2" />
                    Registrarse
                  </button>
                </div>
              </div>
            </form>

            <div class="has-text-centered mt-4">
              <p class="is-size-7 has-text-grey">
                ¿Ya tienes cuenta? 
                <NuxtLink to="/login" class="has-text-weight-semibold" style="color: #667eea;">
                  Inicia sesión aquí
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>