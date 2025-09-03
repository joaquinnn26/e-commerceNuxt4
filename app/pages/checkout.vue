<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const { fetchCart, setUserFromStorage } = useCart()

const cart = ref([]) // siempre empieza como array vacío
const envio = ref({
  nombre: '',
  direccion: '',
  localidad: '',
  codigoPostal: '',
  ciudad: '',
  provincia: ''
})

const finalizarCompra = async () => {
  const config = useRuntimeConfig()
  const numeroVendedor = config.public.numeroVendedor

  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) {
    alert("Debes iniciar sesión")
    return
  }

  const camposVacios = Object.entries(envio.value)
    .filter(([key, value]) => value.trim() === "")
    .map(([key]) => key)

  if (camposVacios.length > 0) {
    alert(`Por favor completa los siguientes campos: ${camposVacios.join(", ")}`)
    return
  }

  if (cart.value.length === 0) {
    alert("El carrito está vacío.")
    return
  }


  try {
    await $fetch("/api/orders/createOrder", {
      method: "POST",
      body: {
        userId: user.id, // el ID del usuario logueado
        items: cart.value.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        total: total.value,
        estado: "pendiente"
      }
    })
  } catch (error) {
    alert(error.message || "Error al crear la orden en la base de datos")
    return
  }


  let detalleProductos = cart.value
    .map(
      (item) =>
        `${item.productId.nombre} x${item.quantity} - $${item.productId.precio * item.quantity}`
    )
    .join("\n");

  let datosEnvio = `
Nombre: ${envio.value.nombre}
Dirección: ${envio.value.direccion}
Localidad: ${envio.value.localidad}
Código Postal: ${envio.value.codigoPostal}
Ciudad: ${envio.value.ciudad}
Provincia: ${envio.value.provincia}
  `;

  let mensaje = `📦 Nueva compra:\n\n${detalleProductos}\n\n💰 Total: $${total.value}\n\n🚚 Datos de envío:\n${datosEnvio}`;

  // 3️⃣ Abrir WhatsApp
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};


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
      <div class="box mt-4">
    <h2 class="subtitle">Datos de envío</h2>
    <input v-model="envio.nombre" type="text" placeholder="Nombre completo" class="input mb-2" />
    <input v-model="envio.direccion" type="text" placeholder="Dirección (calle, número, piso, depto)" class="input mb-2" />
    <input v-model="envio.localidad" type="text" placeholder="Localidad" class="input mb-2" />
    <input v-model="envio.codigoPostal" type="text" placeholder="Código Postal" class="input mb-2" />
    <input v-model="envio.ciudad" type="text" placeholder="Ciudad" class="input mb-2" />
    <input v-model="envio.provincia" type="text" placeholder="Provincia" class="input mb-2" />

    <div class="level">
      <div class="level-left">
        <strong>Total a pagar: ${{ total }}</strong>
      </div>
    </div>

    <button 
      class="button is-primary mt-4"
      @click="finalizarCompra"
    >
      Finalizar Compra via WhatsApp
    </button>
  </div>
  </div>
  </section>
</template>