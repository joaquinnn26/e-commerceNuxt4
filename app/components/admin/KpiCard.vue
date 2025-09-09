<template>
  <div class="card has-text-centered" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
    <div class="card-content">
      <h3 class="subtitle is-6 has-text-white-ter">{{ title }}</h3>
      <p class="title is-2 has-text-white">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number]
})
</script>