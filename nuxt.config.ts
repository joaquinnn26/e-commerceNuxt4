
export default defineNuxtConfig({
  css: [
    'bulma/css/bulma.css',
    
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      numeroVendedor: process.env.NUXT_PUBLIC_NUMERO_VENDEDOR
    },
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
  }
})

