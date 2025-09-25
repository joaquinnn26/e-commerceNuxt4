<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  mode: { type: String, default: 'create' },
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['update:isActive', 'update:modelValue', 'save'])

const localProduct = ref({ ...props.modelValue })
const selectedFile = ref(null)
const uploading = ref(false)
const uploadError = ref(null)

watch(() => props.modelValue, (newVal) => { localProduct.value = { ...newVal } })
watch(() => props.isActive, (active) => {
  if (active) {
    if (props.mode === 'create') {
      localProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' }
    } else {
      localProduct.value = { ...props.modelValue }
    }
    selectedFile.value = null
    uploadError.value = null
  }
})

watch(() => props.mode, (newMode) => {
  if (props.isActive) {
    if (newMode === 'create') {
      localProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' }
    } else {
      localProduct.value = { ...props.modelValue }
    }
    selectedFile.value = null
    uploadError.value = null
  }
})

const handleFileChange = (e) => { selectedFile.value = e.target.files[0] }

const uploadImage = async () => {
  if (!selectedFile.value) return null
  uploading.value = true
  uploadError.value = null
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.readAsDataURL(selectedFile.value)
    reader.onload = async () => {
      try {
        const res = await $fetch('/api/products/upload', {
          method: 'POST',
          body: { image: reader.result }
        })
        uploading.value = false
        resolve(res.url)
      } catch (err) {
        uploading.value = false
        uploadError.value = err.message || 'Error al subir imagen'
        reject(uploadError.value)
      }
    }
  })
}

const save = async () => {
  try {
    // Si hay una nueva imagen seleccionada, subirla
    if (selectedFile.value) {
      const url = await uploadImage()
      if (!url) return
      localProduct.value.imagen = url
    }
    
    // Enviar los datos del producto
    emit('save', localProduct.value)
    emit('update:isActive', false)
    
    // Resetear el estado después de guardar
    setTimeout(() => {
      if (props.mode === 'create') {
        localProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '', categoria: '', destacado: false, _id: '' }
      }
      selectedFile.value = null
      uploadError.value = null
    }, 100)
  } catch (error) {
    // Error silencioso - el usuario ya ve el resultado
  }
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="emit('update:isActive', false)"></div>
    <div class="modal-card" style="max-width: 90vw; width: 500px; border-radius:10px;">
  <header class="modal-card-head" style="background: linear-gradient(135deg, var(--primary-600), var(--secondary-600));">
        <p class="modal-card-title has-text-white">{{ mode === 'create' ? 'Crear' : 'Editar' }} Producto</p>
        <button class="delete" @click="emit('update:isActive', false)"></button>
      </header>
      <section class="modal-card-body">
        <!-- Nombre -->
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input is-rounded" v-model="localProduct.nombre" placeholder="Nombre del producto" />
          </div>
        </div>

        <!-- Categoría -->
        <div class="field">
          <label class="label">Categoría</label>
          <div class="control">
            <div class="select is-fullwidth is-rounded">
              <select v-model="localProduct.categoria">
                <option value="">Seleccionar categoría</option>
                <option value="electronica">Electrónica</option>
                <option value="ropa">Ropa</option>
                <option value="hogar">Hogar</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Precio y Stock -->
        <div class="columns is-mobile">
          <div class="column is-half-mobile">
            <div class="field">
              <label class="label">Precio</label>
              <div class="control">
                <input class="input is-rounded" type="number" v-model="localProduct.precio" placeholder="Precio" />
              </div>
            </div>
          </div>
          <div class="column is-half-mobile">
            <div class="field">
              <label class="label">Stock</label>
              <div class="control">
                <input class="input is-rounded" type="number" v-model="localProduct.stock" placeholder="Stock" />
              </div>
            </div>
          </div>
        </div>

        <!-- Imagen -->
        <div class="field">
          <label class="label">Imagen</label>
          <div class="control">
            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input class="file-input" type="file" @change="handleFileChange">
                <span class="file-cta">
                  <span class="file-label">Seleccionar imagen...</span>
                </span>
                <span class="file-name" v-if="selectedFile">{{ selectedFile.name }}</span>
              </label>
            </div>
          </div>
          <p v-if="uploadError" class="help is-danger">{{ uploadError }}</p>
          <p v-if="uploading" class="help is-info">Subiendo imagen...</p>
          <div v-if="localProduct.imagen" class="mt-2 has-text-centered">
            <figure class="image is-128x128 is-inline-block">
              <img :src="localProduct.imagen" alt="Preview" style="object-fit: cover; border-radius: 8px;" />
            </figure>
          </div>
        </div>

        <!-- Descripción -->
        <div class="field">
          <label class="label">Descripción</label>
          <div class="control">
            <textarea class="textarea is-rounded" v-model="localProduct.descripcion" placeholder="Descripción"></textarea>
          </div>
        </div>

        <!-- Producto Destacado -->
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="localProduct.destacado">
              <span class="ml-2 has-text-weight-semibold">
                ⭐ Marcar como producto destacado
              </span>
            </label>
            <p class="help is-info">
              Los productos destacados aparecerán en el carrusel de la página principal
            </p>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot is-justify-content-space-between is-flex-wrap-wrap">
        <button class="button is-rounded mb-2" @click="save" :disabled="uploading" style="background: linear-gradient(135deg, var(--primary-600), var(--secondary-600)); color: white; border: none;">
          {{ uploading ? 'Subiendo...' : 'Guardar' }}
        </button>
        <button class="button is-light is-rounded mb-2" @click="emit('update:isActive', false)" :disabled="uploading">Cancelar</button>
      </footer>
    </div>
  </div>
</template>
