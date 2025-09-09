export default defineNuxtRouteMiddleware((to, from) => {
  // Verificar si estamos en el cliente
  if (process.client) {
    const user = localStorage.getItem('user')
    
    if (!user) {
      // Usuario no logueado - redirigir a login con mensaje y redirección
      return navigateTo(`/login?message=Debes iniciar sesión para acceder a esta página&redirect=${to.fullPath}`)
    }
    
    try {
      const userData = JSON.parse(user)
      if (!userData || !userData.token) {
        // Token inválido - redirigir a login
        return navigateTo(`/login?message=Sesión expirada, inicia sesión nuevamente&redirect=${to.fullPath}`)
      }
    } catch (error) {
      // Error al parsear datos - redirigir a login
      return navigateTo(`/login?message=Error de autenticación, inicia sesión nuevamente&redirect=${to.fullPath}`)
    }
  }
})
