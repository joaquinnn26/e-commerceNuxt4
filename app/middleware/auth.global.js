export default defineNuxtRouteMiddleware((to) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')

    const privateRoutes = ['/checkout', '/pedidos', '/perfil', '/admin']

    if (!token && privateRoutes.some(route => to.path.startsWith(route))) {
      return navigateTo('/login')
    }
  }
})