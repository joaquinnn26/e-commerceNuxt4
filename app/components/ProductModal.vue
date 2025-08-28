<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  mode: { type: String, default: 'create' }, // create | edit
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['update:isActive', 'update:modelValue', 'save'])

const localProduct = ref({ ...props.modelValue })

// Actualizar localProduct cuando cambie modelValue
watch(() => props.modelValue, (newVal) => {
  localProduct.value = { ...newVal }
})

// Resetear formulario al abrir modal en create
watch(() => props.isActive, (active) => {
  if (active && props.mode === 'create') {
    localProduct.value = { nombre: '', precio: 0, descripcion: '', stock: 0, imagen: '' }
  }
})

const save = () => {
  emit('save', localProduct.value)
  emit('update:isActive', false) // cerrar modal después de guardar
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="emit('update:isActive', false)"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ mode === 'create' ? 'Crear' : 'Editar' }} Producto</p>
        <button class="delete" aria-label="close" @click="emit('update:isActive', false)"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input" v-model="localProduct.nombre" placeholder="Nombre" />
          </div>
        </div>

        <div class="field">
          <label class="label">Precio</label>
          <div class="control">
            <input class="input" type="number" v-model="localProduct.precio" placeholder="Precio" />
          </div>
        </div>

        <div class="field">
          <label class="label">Stock</label>
          <div class="control">
            <input class="input" type="number" v-model="localProduct.stock" placeholder="Cantidad en stock" />
          </div>
        </div>

        <div class="field">
          <label class="label">Imagen URL</label>
          <div class="control">
            <input class="input" type="text" v-model="localProduct.imagen" placeholder="URL de la imagen" />
          </div>
        </div>

        <div class="field">
          <label class="label">Descripción</label>
          <div class="control">
            <textarea class="textarea" v-model="localProduct.descripcion" placeholder="Descripción"></textarea>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot">
        <button class="button is-success" @click="save">Guardar</button>
        <button class="button" @click="emit('update:isActive', false)">Cancelar</button>
      </footer>
    </div>
  </div>
</template>