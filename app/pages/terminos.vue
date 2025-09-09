<script setup>
import { FileText, ShoppingCart, CreditCard, Truck, Shield, AlertTriangle, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  title: 'Términos y Condiciones'
})
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8-desktop is-10-tablet">
          <div class="content">
            <!-- Header -->
            <div class="has-text-centered mb-6">
              <div class="is-flex is-justify-content-center mb-3">
                <div class="box p-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                  <FileText :size="32" />
                </div>
              </div>
              <h1 class="title is-2 has-text-weight-bold">Términos y Condiciones</h1>
              <p class="subtitle is-5 has-text-grey">Última actualización: {{ new Date().toLocaleDateString('es-ES') }}</p>
            </div>

            <!-- Introducción -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <CheckCircle :size="20" class="mr-2" />
                Introducción
              </h2>
              <p class="mb-3">
                Bienvenido a <strong>MiTienda</strong>. Estos Términos y Condiciones rigen el uso de nuestro sitio web y la compra de productos a través de nuestra plataforma.
              </p>
              <p>
                Al acceder y utilizar nuestro sitio web, usted acepta estar sujeto a estos términos. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
            </div>

            <!-- Definiciones -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Definiciones</h2>
              <ul>
                <li><strong>"Nosotros", "Nuestro", "La Empresa":</strong> Se refiere a MiTienda</li>
                <li><strong>"Usuario", "Cliente", "Usted":</strong> Se refiere a cualquier persona que acceda o utilice nuestro sitio web</li>
                <li><strong>"Productos":</strong> Se refiere a todos los bienes ofrecidos en nuestro sitio web</li>
                <li><strong>"Servicios":</strong> Se refiere a todos los servicios proporcionados a través de nuestro sitio web</li>
              </ul>
            </div>

            <!-- Uso del sitio web -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Shield :size="20" class="mr-2" />
                Uso del Sitio Web
              </h2>
              <h3 class="title is-5 mb-2">Uso Permitido</h3>
              <ul class="mb-3">
                <li>Navegar y explorar nuestros productos</li>
                <li>Realizar compras de productos disponibles</li>
                <li>Crear una cuenta de usuario</li>
                <li>Contactar nuestro servicio al cliente</li>
              </ul>
              
              <h3 class="title is-5 mb-2">Uso Prohibido</h3>
              <ul>
                <li>Utilizar el sitio para actividades ilegales</li>
                <li>Intentar acceder a áreas restringidas</li>
                <li>Interferir con el funcionamiento del sitio</li>
                <li>Copiar o distribuir contenido sin autorización</li>
              </ul>
            </div>

            <!-- Compras y pedidos -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <ShoppingCart :size="20" class="mr-2" />
                Compras y Pedidos
              </h2>
              <h3 class="title is-5 mb-2">Proceso de Compra</h3>
              <ol class="mb-3">
                <li>Seleccionar productos y agregarlos al carrito</li>
                <li>Revisar el pedido y proporcionar información de envío</li>
                <li>Seleccionar método de pago</li>
                <li>Confirmar el pedido</li>
                <li>Recibir confirmación por email</li>
              </ol>
              
              <h3 class="title is-5 mb-2">Disponibilidad</h3>
              <p>
                Todos los productos están sujetos a disponibilidad. Nos reservamos el derecho de limitar las cantidades y rechazar pedidos.
              </p>
            </div>

            <!-- Precios y pagos -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <CreditCard :size="20" class="mr-2" />
                Precios y Pagos
              </h2>
              <h3 class="title is-5 mb-2">Precios</h3>
              <ul class="mb-3">
                <li>Todos los precios están expresados en pesos argentinos</li>
                <li>Los precios incluyen IVA cuando corresponda</li>
                <li>Nos reservamos el derecho de cambiar precios sin previo aviso</li>
                <li>Los precios mostrados son válidos al momento de la compra</li>
              </ul>
              
              <h3 class="title is-5 mb-2">Métodos de Pago</h3>
              <ul>
                <li>Efectivo (pago contra entrega)</li>
                <li>Transferencia bancaria</li>
                <li>Mercado Pago</li>
                <li>Otros métodos disponibles según región</li>
              </ul>
            </div>

            <!-- Envíos y entregas -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Truck :size="20" class="mr-2" />
                Envíos y Entregas
              </h2>
              <h3 class="title is-5 mb-2">Tiempos de Entrega</h3>
              <ul class="mb-3">
                <li>Área metropolitana: 24-48 horas hábiles</li>
                <li>Interior del país: 3-7 días hábiles</li>
                <li>Los tiempos pueden variar según disponibilidad</li>
              </ul>
              
              <h3 class="title is-5 mb-2">Costos de Envío</h3>
              <ul>
                <li>Envío gratuito en compras superiores a $10,000</li>
                <li>Costo de envío calculado según destino</li>
                <li>Retiro en local sin costo adicional</li>
              </ul>
            </div>

            <!-- Devoluciones y cambios -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <AlertTriangle :size="20" class="mr-2" />
                Devoluciones y Cambios
              </h2>
              <h3 class="title is-5 mb-2">Política de Devolución</h3>
              <ul class="mb-3">
                <li>Plazo de 30 días para devoluciones</li>
                <li>Productos deben estar en condiciones originales</li>
                <li>Se requiere comprobante de compra</li>
                <li>Los gastos de envío corren por cuenta del cliente</li>
              </ul>
              
              <h3 class="title is-5 mb-2">Cambios</h3>
              <ul>
                <li>Cambios por defectos de fábrica sin costo</li>
                <li>Cambios por talla o color sujetos a disponibilidad</li>
                <li>Plazo de 15 días para cambios</li>
              </ul>
            </div>

            <!-- Limitación de responsabilidad -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Limitación de Responsabilidad</h2>
              <p class="mb-3">
                En la máxima medida permitida por la ley, MiTienda no será responsable por:
              </p>
              <ul>
                <li>Daños indirectos, incidentales o consecuenciales</li>
                <li>Pérdida de ganancias o datos</li>
                <li>Interrupciones del servicio</li>
                <li>Errores en la información del producto</li>
              </ul>
            </div>

            <!-- Modificaciones -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web. Es responsabilidad del usuario revisar periódicamente estos términos.
              </p>
            </div>

            <!-- Ley aplicable -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Ley Aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
              </p>
            </div>

            <!-- Contacto -->
            <div class="box">
              <h2 class="title is-4 mb-3">Contacto</h2>
              <p class="mb-3">
                Para consultas sobre estos Términos y Condiciones, puede contactarnos:
              </p>
              <div class="content">
                <p><strong>Email:</strong> legal@mitienda.com</p>
                <p><strong>Teléfono:</strong> +54 11 1234-5678</p>
                <p><strong>Dirección:</strong> Av. Corrientes 1234, CABA, Argentina</p>
              </div>
            </div>

            <!-- Botón de regreso -->
            <div class="has-text-centered mt-6">
              <NuxtLink to="/" class="button is-medium" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                Volver al Inicio
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
