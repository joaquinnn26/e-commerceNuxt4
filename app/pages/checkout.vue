<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'
import { ShoppingBag, User, MapPin, CreditCard, MessageCircle } from 'lucide-vue-next'
import Swal from 'sweetalert2'

// Proteger la página - solo usuarios logueados
definePageMeta({
  middleware: 'auth'
})

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
    Swal.fire({
      icon: 'warning',
      title: 'Acceso requerido',
      text: 'Debes iniciar sesión para continuar'
    })
    return
  }

  const camposVacios = Object.entries(envio.value)
    .filter(([key, value]) => value.trim() === "")
    .map(([key]) => key)

  if (camposVacios.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: `Por favor completa los siguientes campos: ${camposVacios.join(", ")}`
    })
    return
  }

  if (cart.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'El carrito está vacío.'
    })
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
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || "Error al crear la orden en la base de datos"
    })
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

try {
    
    
    const res = await $fetch('/api/checkout', {
      method: 'POST',
      body: { cart: cartPlano }
    })
    window.location.href = res.init_point
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Error al iniciar pago'
    })
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
      <div class="has-text-centered mb-6">
        <h1 class="title text-gradient">
          <ShoppingBag :size="24" class="mr-3" />
          Resumen de Compra
        </h1>
        <p class="subtitle is-6 has-text-grey">Revisa tu pedido y completa los datos</p>
      </div>

      <div class="columns is-multiline">
        <!-- Resumen del carrito -->
        <div class="column is-full-tablet is-two-thirds-desktop">
          <div class="box">
            <h2 class="title is-5 mb-4">
              <ShoppingBag :size="20" class="mr-2" />
              Productos en tu carrito
            </h2>
            <div class="table-container">
              <table class="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in cart" :key="item._id">
                    <tr v-if="item.productId">
                      <td>{{ item.productId?.nombre || 'Producto eliminado' }}</td>
                      <td>$ {{ item.productId?.precio || 0 }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>$ {{ (item.productId?.precio || 0) * item.quantity }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Datos de envío -->
        <div class="column is-full-tablet is-one-third-desktop">
          <div class="box">
            <h2 class="title is-5 mb-4">
              <MapPin :size="20" class="mr-2" />
              Datos de envío
            </h2>
            
            <div class="field">
              <label class="label">Nombre completo</label>
              <div class="control has-icons-left">
                <input v-model="envio.nombre" type="text" placeholder="Tu nombre completo" class="input" required />
                <span class="icon is-small is-left">
                  <User :size="16" />
                </span>
              </div>
            </div>

            <div class="field">
              <label class="label">Dirección</label>
              <input v-model="envio.direccion" type="text" placeholder="Calle, número, piso, depto" class="input" required />
            </div>

            <div class="field">
              <label class="label">Localidad</label>
              <input v-model="envio.localidad" type="text" placeholder="Localidad" class="input" required />
            </div>

            <div class="field">
              <label class="label">Código Postal</label>
              <input v-model="envio.codigoPostal" type="text" placeholder="Código Postal" class="input" required />
            </div>

            <div class="field">
              <label class="label">Ciudad</label>
              <input v-model="envio.ciudad" type="text" placeholder="Ciudad" class="input" required />
            </div>

            <div class="field">
              <label class="label">Provincia</label>
              <input v-model="envio.provincia" type="text" placeholder="Provincia" class="input" required />
            </div>

            <div class="box has-background-light">
              <div class="is-flex is-justify-content-space-between is-align-items-center">
                <span class="title is-5">Total a pagar:</span>
                <span class="title is-4 has-text-primary">${{ total }}</span>
              </div>
            </div>

            <button 
              class="button is-fullwidth mt-4"
              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;"
              @click="finalizarCompra"
            >
              <MessageCircle :size="18" class="mr-2" />
              Finalizar Compra via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>