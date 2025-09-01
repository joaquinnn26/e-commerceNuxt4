<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const { fetchCart, setUserFromStorage } = useCart()

const cart = ref([]) // siempre empieza como array vacío

onMounted(async () => {
  setUserFromStorage()
  const fetchedCart = await fetchCart()
  
  // Si fetchCart devuelve un ref
  if (fetchedCart?.value) {
    cart.value = fetchedCart.value
  }
  // Si devuelve un array plano
  else if (Array.isArray(fetchedCart)) {
    cart.value = fetchedCart
  }
})

const handlePago = async () => {
  const cartPlano = JSON.parse(JSON.stringify(cart.value))
console.log("cartPlano", cartPlano);

try {
    
    
    const res = await $fetch('/api/checkout', {
      method: 'POST',
      body: { cart: cartPlano }
    })
    window.location.href = res.init_point
  } catch (err) {
    alert(err.message || 'Error al iniciar pago')
  }
}

const total = computed(() =>
  (cart.value || []).reduce(
    (acc, i) => acc + (i.productId?.precio || 0) * (i.quantity || 0),
    0
  )
)
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Resumen de Compra</h1>

      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item._id">
            <td>{{ item.productId.nombre }}</td>
            <td>$ {{ item.productId.precio }}</td>
            <td>{{ item.quantity }}</td>
            <td>$ {{ item.productId.precio * item.quantity }}</td>
          </tr>
        </tbody>
      </table>

      <div class="level">
        <div class="level-left">
          <strong>Total a pagar: ${{ total }}</strong>
        </div>
      </div>

      <button class="button is-primary mt-4" @click="handlePago">
        Pagar con Mercado Pago
      </button>
    </div>
  </section>
</template>