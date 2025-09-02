<template>
  <div class="bg-white shadow rounded-lg p-4 text-center border">
    <h3 class="text-gray-500 text-sm">{{ title }}</h3>
    <p class="text-2xl font-bold">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>