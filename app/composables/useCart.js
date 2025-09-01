import { ref } from 'vue'

const cart = ref([])
const userId = ref('')

export const useCart = () => {
  const setUserFromStorage = () => {
    const id = localStorage.getItem('user')
    if (id) userId.value = id
  }

  const fetchCart = async () => {
    if (!userId.value) return
    try {
      const res = await $fetch(`/api/cart/${userId.value}`)
      cart.value = res.items 
      return cart
    } catch (err) {
      alert(err.message || 'Error al cargar carrito')
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!userId.value) return alert('Debes iniciar sesión')
    try {
      await $fetch('/api/cart/addItem', {
        method: 'POST',
        body: { userId: userId.value, productId, quantity }
      })
      await fetchCart()
    } catch (err) {
      alert(err.message || 'Error al agregar al carrito')
    }
  }

  const removeFromCart = async (productId) => {
    if (!userId.value) return alert('Debes iniciar sesión')
    try {
      await $fetch('/api/cart/removeItem', {
        method: 'POST',
        body: { userId: userId.value, productId }
      })
      await fetchCart()
    } catch (err) {
      alert(err.message || 'Error al eliminar del carrito')
    }
  }

  const checkout = async (nombre, tarjeta) => {
    if (!userId.value) return alert('Debes iniciar sesión')
    try {
      const res = await $fetch('/api/checkout', {
        method: 'POST',
        body: { userId: userId.value, nombre, tarjeta }
      })
      cart.value = [] 
      return res
    } catch (err) {
      alert(err.message || 'Error al procesar pago')
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