<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  const sharedBlinkState = ref(false)
  let activeConsumers = 0
  let blinkLoopTimer: ReturnType<typeof setTimeout> | null = null
  let blinkFrameTimer: ReturnType<typeof setTimeout> | null = null

  const props = withDefaults(defineProps<{
    alt?: string
    size?: 'sm' | 'md' | 'lg'
  }>(), {
    alt: 'AI assistant avatar',
    size: 'md',
  })

  const config = useRuntimeConfig()
  const baseURL = computed(() => config.app.baseURL || '/')
  const normalSrc = computed(() => `${baseURL.value}ia.png`)
  const blinkSrc = computed(() => `${baseURL.value}ia_2.png`)
  const currentSrc = computed(() => sharedBlinkState.value ? blinkSrc.value : normalSrc.value)

  function scheduleBlink () {
    const delay = 3200 + Math.round(Math.random() * 3600)

    blinkLoopTimer = window.setTimeout(() => {
      sharedBlinkState.value = true

      blinkFrameTimer = window.setTimeout(() => {
        sharedBlinkState.value = false
        scheduleBlink()
      }, 180)
    }, delay)
  }

  onMounted(() => {
    activeConsumers += 1

    if (activeConsumers === 1) {
      scheduleBlink()
    }
  })

  onUnmounted(() => {
    activeConsumers = Math.max(0, activeConsumers - 1)

    if (activeConsumers > 0) {
      return
    }

    sharedBlinkState.value = false

    if (blinkLoopTimer) {
      window.clearTimeout(blinkLoopTimer)
      blinkLoopTimer = null
    }

    if (blinkFrameTimer) {
      window.clearTimeout(blinkFrameTimer)
      blinkFrameTimer = null
    }
  })
</script>

<template>
  <span :class="['assistant-avatar', `assistant-avatar--${props.size}`]">
    <img :alt="props.alt" :src="currentSrc">
  </span>
</template>

<style scoped>
  .assistant-avatar {
    align-items: center;
    background: linear-gradient(180deg, var(--portfolio-surface-start), var(--portfolio-surface-end));
    border: 1px solid var(--portfolio-border-strong);
    border-radius: 999px;
    box-shadow: var(--portfolio-shadow);
    display: inline-flex;
    flex: 0 0 auto;
    justify-content: center;
    overflow: hidden;
    transition:
      border-color 220ms ease,
      transform 220ms ease;
  }

  .assistant-avatar img {
    display: block;
    height: 100%;
    object-fit: cover;
    /* width: 100%; */
  }

  .assistant-avatar--sm {
    height: 28px;
    width: 28px;
  }

  .assistant-avatar--md {
    height: 40px;
    width: 40px;
  }

  .assistant-avatar--lg {
    height: 52px;
    width: 52px;
  }
</style>
