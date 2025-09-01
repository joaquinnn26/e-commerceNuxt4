<script setup>
import { computed } from 'vue'
const props = defineProps({
  isActive: Boolean,
  cart: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'update:cart', 'checkout'])

const close = () => emit('close')


const total = computed(() => props.cart.reduce((acc, i) => acc + (i.productId.precio * i.quantity), 0))
</script>

<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content box">
      <h3 class="title">Mi Carrito</h3>
      <table class="table is-fullwidth">
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
          <tr v-for="item in cart" :key="item._id">
            <td>{{ item.productId.nombre }}</td>
            <td>$ {{ item.productId.precio }}</td>
            <td>
              <button class="button is-small"
                @click="$emit('update:cart', { type: 'decrement', productId: item.productId._id })">-</button>
              {{ item.quantity }}
              <button class="button is-small"
                @click="$emit('update:cart', { type: 'increment', productId: item.productId._id })">+</button>
            </td>
            <td>$ {{ item.productId.precio * item.quantity }}</td>
            <td>
              <button class="button is-danger is-small"
                @click="$emit('update:cart', { type: 'remove', productId: item.productId._id })">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="level mt-4">
        <div class="level-left">
          <strong>Total: $ {{ total }}</strong>
        </div>
        <div class="level-right">
          <button class="button is-primary" @click="$emit('checkout')">Pagar</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="close"></button>
  </div>
</template>