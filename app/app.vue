<template>
  <div>
    <Header />
    <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
    <Footer/>
  </div>
</template>
<script setup>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import '../assets/css/global.css'
</script>