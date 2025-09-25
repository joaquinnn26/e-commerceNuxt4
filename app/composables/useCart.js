import { ref } from 'vue'
import Swal from 'sweetalert2'

const cart = ref([])
const userId = ref('')

export const useCart = () => {
  const setUserFromStorage = () => {
    const userString = localStorage.getItem('user')
   if (!userString) return
  try {
    const user = JSON.parse(userString)
    if (user.id) userId.value = user.id // ✅ solo el ObjectId
  } catch (err) {
    // Error silencioso - usuario no válido en localStorage
  }
  }

  const fetchCart = async () => {
    if (!userId.value) return
    try {
      const res = await $fetch(`/api/cart/${userId.value}`)
      // Filtrar elementos con productId nulo
      cart.value = res.items?.filter(item => item.productId) || []
      return cart
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Error al cargar carrito'
      })
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!userId.value) return Swal.fire('Error', 'Debes iniciar sesión', 'error')
    try {
      const safeQty = Math.max(-99, Math.min(99, Math.trunc(Number(quantity) || 0)))
      if (safeQty === 0) return
      await $fetch('/api/cart/addItem', {
        method: 'POST',
        body: { userId: userId.value, productId, quantity: safeQty }
      })
      await fetchCart()
      if (safeQty > 0) Swal.fire('¡Éxito!', 'Producto agregado al carrito', 'success')
    } catch (err) {
      Swal.fire('Error', err.message || 'Error al agregar al carrito', 'error')
    }
  }

  const removeFromCart = async (productId) => {
    if (!userId.value) return Swal.fire('Error', 'Debes iniciar sesión', 'error')
    try {
      await $fetch('/api/cart/removeItem', {
        method: 'POST',
        body: { userId: userId.value, productId }
      })
      await fetchCart()
      Swal.fire('¡Éxito!', 'Producto eliminado del carrito', 'success')
    } catch (err) {
      Swal.fire('Error', err.message || 'Error al eliminar del carrito', 'error')
    }
  }

  const checkout = async (nombre, tarjeta) => {
    if (!userId.value) return Swal.fire('Error', 'Debes iniciar sesión', 'error')
    try {
      const res = await $fetch('/api/checkout', {
        method: 'POST',
        body: { userId: userId.value, nombre, tarjeta }
      })
      cart.value = [] 
      return res
    } catch (err) {
      Swal.fire('Error', err.message || 'Error al procesar pago', 'error')
    }
  }


  return {
    cart,
    userId,
    setUserFromStorage,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout
  }
}