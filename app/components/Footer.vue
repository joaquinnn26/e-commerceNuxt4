<script setup>
// Footer simplificado sin iconos para evitar problemas de hidratación
</script>

<template>
<footer class="footer has-text-white-ter" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="container">
      <div class="columns is-mobile is-vcentered">
        <!-- Información básica -->
        <div class="column">
          <div class="content">
            <h4 class="title is-5 has-text-white mb-2">MiTienda</h4>
            <p class="has-text-white-ter is-size-7 mb-2">
              Tu tienda online de confianza
            </p>
            <div class="is-flex is-flex-wrap-wrap" style="gap: 0.5rem;">
              <a href="#" class="button is-small is-light" style="border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" title="Facebook">
                FB
              </a>
              <a href="#" class="button is-small is-light" style="border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" title="Instagram">
                IG
              </a>
              <a href="#" class="button is-small is-light" style="border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" title="WhatsApp">
                WA
              </a>
            </div>
          </div>
        </div>

        <!-- Contacto -->
        <div class="column is-narrow">
          <div class="content">
            <div class="is-size-7 has-text-white-ter">
              <p class="mb-1">
                📞 +54 11 1234-5678
              </p>
              <p class="mb-1">
                ✉️ info@mitienda.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Línea divisoria -->
      <hr class="has-background-white-ter" style="margin: 1rem 0;">

      <!-- Copyright y enlaces legales -->
      <div class="columns is-mobile is-vcentered">
        <div class="column">
          <p class="has-text-white-ter is-size-7">
            © 2025 MiTienda. Desarrollado por <strong>Next Code</strong>
          </p>
        </div>
        <div class="column is-narrow">
          <div class="is-flex is-flex-wrap-wrap" style="gap: 1rem;">
            <a href="/terminos" class="has-text-white-ter is-size-7" style="text-decoration: none;">
              Términos
            </a>
            <a href="/privacidad" class="has-text-white-ter is-size-7" style="text-decoration: none;">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>