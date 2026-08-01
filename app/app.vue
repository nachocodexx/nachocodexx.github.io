<script setup lang="ts">
  const route = useRoute()
  const isAdminRoute = computed(() => route.path.startsWith('/admin/'))
  const postsStore = usePostsStore()
  const commentsStore = useCommentsStore()

  function refreshVisibleCaches () {
    if (document.visibilityState !== 'hidden') {
      postsStore.refreshActiveCaches()
      commentsStore.refreshActiveCache()
    }
  }

  onMounted(() => {
    window.addEventListener('focus', refreshVisibleCaches)
    document.addEventListener('visibilitychange', refreshVisibleCaches)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('focus', refreshVisibleCaches)
    document.removeEventListener('visibilitychange', refreshVisibleCaches)
  })
</script>

<template>
  <v-app>
    <AppThemeController />

    <v-main>
      <NuxtPage />
    </v-main>

    <AppAssistantWidget v-if="!isAdminRoute" />
  </v-app>
</template>
