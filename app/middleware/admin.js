export default defineNuxtRouteMiddleware((to) => {
  if (typeof window !== 'undefined') { // Esto indica que estamos en el cliente
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role') // guardaste el rol al logear

    if (!token) return navigateTo('/login')
    if (role !== 'admin') return navigateTo('/no-autorizado')
  }
})