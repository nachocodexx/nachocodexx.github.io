import MarkdownPre from '@/components/MarkdownPre.vue'
import SpecialText from '@/components/SpecialText.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('MarkdownPre', MarkdownPre)
  nuxtApp.vueApp.component('SpecialText', SpecialText)
})
