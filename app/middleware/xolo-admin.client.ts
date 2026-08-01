export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useXoloAuthStore()

  if (await authStore.validateSession()) {
    return
  }

  return navigateTo({
    path: '/admin/login',
    query: { redirect: to.fullPath },
  })
})
