export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return
  const storedUser = localStorage.getItem('user')
  if (!storedUser) return navigateTo('/')

  const { token } = JSON.parse(storedUser)
  try {
    const { role } = await $fetch('/api/auth/validate', {
      method: 'POST',
      body: { token }
    })
    if (role !== 'admin') return navigateTo('/')
  } catch {
    return navigateTo('/login')
  }
})