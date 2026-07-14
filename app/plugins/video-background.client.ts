import { videoBackgroundPlugin } from '@hintay/vue-video-background'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(videoBackgroundPlugin)
})
