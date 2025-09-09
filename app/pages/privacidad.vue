<script setup>
import { Shield, Eye, Lock, Database, UserCheck, Mail } from 'lucide-vue-next'

definePageMeta({
  title: 'Política de Privacidad'
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
                  <Shield :size="32" />
                </div>
              </div>
              <h1 class="title is-2 has-text-weight-bold">Política de Privacidad</h1>
              <p class="subtitle is-5 has-text-grey">Última actualización: {{ new Date().toLocaleDateString('es-ES') }}</p>
            </div>

            <!-- Introducción -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Eye :size="20" class="mr-2" />
                Introducción
              </h2>
              <p class="mb-3">
                En <strong>MiTienda</strong>, nos comprometemos a proteger la privacidad y seguridad de la información personal de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza nuestro sitio web y servicios.
              </p>
              <p>
                Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. Si no está de acuerdo con alguna parte de esta política, le recomendamos que no utilice nuestros servicios.
              </p>
            </div>

            <!-- Información que recopilamos -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Database :size="20" class="mr-2" />
                Información que Recopilamos
              </h2>
              <h3 class="title is-5 mb-2">Información Personal</h3>
              <ul class="mb-3">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de envío y facturación</li>
                <li>Información de pago (procesada de forma segura)</li>
              </ul>
              
              <h3 class="title is-5 mb-2">Información Técnica</h3>
              <ul>
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Cookies y tecnologías similares</li>
              </ul>
            </div>

            <!-- Cómo utilizamos la información -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <UserCheck :size="20" class="mr-2" />
                Cómo Utilizamos su Información
              </h2>
              <p class="mb-3">Utilizamos la información recopilada para:</p>
              <ul>
                <li>Procesar y completar sus pedidos</li>
                <li>Proporcionar soporte al cliente</li>
                <li>Enviar actualizaciones sobre pedidos y promociones</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
              </ul>
            </div>

            <!-- Protección de datos -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Lock :size="20" class="mr-2" />
                Protección de sus Datos
              </h2>
              <p class="mb-3">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
              <ul>
                <li>Encriptación SSL/TLS para transmisión de datos</li>
                <li>Almacenamiento seguro en servidores protegidos</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo regular de seguridad</li>
              </ul>
            </div>

            <!-- Cookies -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Cookies y Tecnologías Similares</h2>
              <p class="mb-3">
                Utilizamos cookies para mejorar su experiencia de navegación, recordar sus preferencias y analizar el tráfico del sitio web.
              </p>
              <p>
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </div>

            <!-- Compartir información -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Compartir Información</h2>
              <p class="mb-3">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              <ul>
                <li>Con su consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                <li>En caso de fusión, adquisición o venta de activos</li>
              </ul>
            </div>

            <!-- Sus derechos -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">Sus Derechos</h2>
              <p class="mb-3">Usted tiene derecho a:</p>
              <ul>
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </div>

            <!-- Contacto -->
            <div class="box mb-5">
              <h2 class="title is-4 mb-3">
                <Mail :size="20" class="mr-2" />
                Contacto
              </h2>
              <p class="mb-3">
                Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, puede contactarnos:
              </p>
              <div class="content">
                <p><strong>Email:</strong> privacidad@mitienda.com</p>
                <p><strong>Teléfono:</strong> +54 11 1234-5678</p>
                <p><strong>Dirección:</strong> Av. Corrientes 1234, CABA, Argentina</p>
              </div>
            </div>

            <!-- Cambios a la política -->
            <div class="box">
              <h2 class="title is-4 mb-3">Cambios a esta Política</h2>
              <p>
                Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Los cambios significativos serán notificados a través de nuestro sitio web o por correo electrónico.
              </p>
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
