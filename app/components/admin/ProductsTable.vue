<template>
  <div class="box">
    <h2 class="title is-5 mb-4">Productos</h2>
    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in products" 
            :key="product._id" 
            :class="{ 'has-background-danger-light': product.stock < 5 }"
          >
            <td>
              <figure class="image is-48x48">
                <img :src="product.imagen" :alt="product.nombre" style="object-fit: cover;" />
              </figure>
            </td>
            <td>{{ product.nombre }}</td>
            <td>${{ product.precio }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span 
                class="tag" 
                :class="product.destacado ? 'is-success' : 'is-light'"
              >
                {{ product.destacado ? '⭐ Destacado' : 'Normal' }}
              </span>
            </td>
            <td>
              <div class="buttons are-small">
                <button 
                  class="button" 
                  :class="product.destacado ? 'is-warning' : 'is-success'"
                  @click="toggleFeatured(product._id, product.destacado)"
                  :disabled="isLoading"
                >
                  {{ product.destacado ? 'Quitar Destacado' : 'Marcar Destacado' }}
                </button>
                <button 
                  class="button is-danger is-small"
                  @click="deleteProduct(product._id)"
                  :disabled="isLoading"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  products: Array
})

const emit = defineEmits(['refresh'])

const isLoading = ref(false)

const toggleFeatured = async (productId, currentStatus) => {
  isLoading.value = true
  try {
    await $fetch(`/api/products/admin/${productId}`, {
      method: 'PUT',
      body: {
        destacado: !currentStatus
      }
    })
    
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: `Producto ${!currentStatus ? 'marcado como destacado' : 'removido de destacados'}`,
      confirmButtonColor: '#4f46e5'
    })
    
    emit('refresh')
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el producto',
      confirmButtonColor: '#4f46e5'
    })
  } finally {
    isLoading.value = false
  }
}

const deleteProduct = async (productId) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    isLoading.value = true
    try {
      await $fetch(`/api/products/admin/${productId}`, {
        method: 'DELETE'
      })
      
      Swal.fire({
        icon: 'success',
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado',
        confirmButtonColor: '#4f46e5'
      })
      
      emit('refresh')
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto',
        confirmButtonColor: '#4f46e5'
      })
    } finally {
      isLoading.value = false
    }
  }
}
</script>