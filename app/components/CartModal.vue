<script setup>
import { computed } from 'vue'
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-vue-next'
const props = defineProps({
  isActive: Boolean,
  cart: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'update:cart', 'checkout'])

const close = () => emit('close')


const total = computed(() => props.cart.reduce((acc, i) => acc + ((i.productId?.precio || 0) * i.quantity), 0))
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content box" style="max-width: 95vw;">
      <h3 class="title is-size-5-mobile">
        <ShoppingCart :size="20" class="mr-2" />
        Mi Carrito
      </h3>

      <!-- Tabla en desktop, lista en mobile -->
      <div class="is-hidden-mobile">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in cart" :key="item._id">
              <tr v-if="item.productId">
                <td>{{ item.productId?.nombre || 'Producto eliminado' }}</td>
                <td>$ {{ item.productId?.precio || 0 }}</td>
                <td>
                <button class="button is-small"
                  @click="$emit('update:cart', { type: 'decrement', productId: item.productId._id })">
                  <Minus :size="16" />
                </button>
                {{ item.quantity }}
                <button class="button is-small"
                  @click="$emit('update:cart', { type: 'increment', productId: item.productId._id })">
                  <Plus :size="16" />
                </button>
                </td>
                <td>$ {{ (item.productId?.precio || 0) * item.quantity }}</td>
                <td>
                  <button class="button is-danger is-small"
                    @click="$emit('update:cart', { type: 'remove', productId: item.productId._id })">
                    <Trash2 :size="16" class="mr-1" />
                    Eliminar
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="is-hidden-tablet">
        <template v-for="item in cart" :key="item._id">
          <div v-if="item.productId" class="box p-3 mb-2">
            <div class="is-flex is-justify-content-space-between is-align-items-center">
              <div>
                <p class="has-text-weight-semibold">{{ item.productId?.nombre || 'Producto eliminado' }}</p>
                <p class="is-size-7">$ {{ item.productId?.precio || 0 }}</p>
              </div>
              <div class="is-flex is-align-items-center">
                <button class="button is-small mr-2" @click="$emit('update:cart', { type: 'decrement', productId: item.productId._id })">
                  <Minus :size="16" />
                </button>
                <span>{{ item.quantity }}</span>
                <button class="button is-small ml-2" @click="$emit('update:cart', { type: 'increment', productId: item.productId._id })">
                  <Plus :size="16" />
                </button>
              </div>
            </div>
            <div class="is-flex is-justify-content-space-between mt-2">
              <span class="has-text-weight-semibold">Subtotal: $ {{ (item.productId?.precio || 0) * item.quantity }}</span>
              <button class="button is-danger is-small" @click="$emit('update:cart', { type: 'remove', productId: item.productId._id })">
                <Trash2 :size="16" class="mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </template>
      </div>

      <div class="level mt-4 is-flex-wrap-wrap">
        <div class="level-left mb-2">
          <strong>Total: $ {{ total }}</strong>
        </div>
        <div class="level-right">
          <button class="button is-fullwidth-mobile" @click="$emit('checkout')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
            <CreditCard :size="18" class="mr-2" />
            Pagar
          </button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>