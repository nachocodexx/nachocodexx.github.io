<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  const { openAssistant } = useAssistantWidget()
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  const heroVideoSrc = `${baseURL}hero_video.mp4`
  const heroPosterSrc = `${baseURL}hero_image.png`

  const trackRef = ref<HTMLElement | null>(null)
  const chipRef = ref<HTMLElement | null>(null)
  const revealDistance = ref(1)
  const revealProgress = ref(0)
  const reducedMotion = ref(false)

  let animationFrame = 0
  let resizeObserver: ResizeObserver | null = null

  const trackStyle = computed<CSSProperties>(() => ({
    '--hero-reveal-distance': `${revealDistance.value}px`,
  }))

  const contentStyle = computed<CSSProperties>(() => ({
    '--hero-content-opacity': revealProgress.value,
    '--hero-content-translate': `${-revealDistance.value * revealProgress.value}px`,
  }))

  function updateRevealProgress () {
    animationFrame = 0

    if (reducedMotion.value) {
      revealProgress.value = 1
      return
    }

    const track = trackRef.value

    if (!track) {
      return
    }

    revealProgress.value = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / revealDistance.value))
  }

  function requestRevealUpdate () {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateRevealProgress)
    }
  }

  function measureRevealDistance () {
    const chip = chipRef.value?.$el as HTMLElement | undefined
    const navigation = document.querySelector<HTMLElement>('.v-app-bar')

    if (!chip || !navigation) {
      return
    }

    const currentTranslation = -revealDistance.value * revealProgress.value
    const chipTopWithoutTranslation = chip.getBoundingClientRect().top - currentTranslation
    const x = 16
    const targetTop = navigation.getBoundingClientRect().bottom + x

    revealDistance.value = Math.max(1, Math.round(chipTopWithoutTranslation - targetTop))
    updateRevealProgress()
  }

  onMounted(() => {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    measureRevealDistance()
    window.addEventListener('scroll', requestRevealUpdate, { passive: true })
    window.addEventListener('resize', measureRevealDistance)

    resizeObserver = new ResizeObserver(measureRevealDistance)

    if (trackRef.value) {
      resizeObserver.observe(trackRef.value)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', requestRevealUpdate)
    window.removeEventListener('resize', measureRevealDistance)
    resizeObserver?.disconnect()

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
    }
  })
</script>

<template>
  <section
    ref="trackRef"
    class="hero-scroll-track motif-border"
    :style="trackStyle"
  >
    <div class="hero-shell">
      <ClientOnly>
        <VideoBackground
          class="hero-shell__video"
          :loop="true"
          :muted="true"
          object-fit="cover"
          object-position="center"
          :poster="heroPosterSrc"
          preload="auto"
          :src="heroVideoSrc"
        />

        <template #fallback>
          <div
            class="hero-shell__poster"
            :style="{ backgroundImage: `url(${heroPosterSrc})` }"
          />
        </template>
      </ClientOnly>

      <div class="hero-shell__overlay" />

      <v-container
        class="hero-shell__content position-relative"
        :class="{ 'hero-shell__content--interactive': revealProgress > 0.02 }"
        max-width="1180"
        :style="contentStyle"
      >
        <v-row align="center">
          <v-col cols="12" lg="8">
            <div class="hero-shell__copy">
              <v-chip ref="chipRef" class="hero-chip text-uppercase" color="primary" variant="tonal">
                Personal portfolio
              </v-chip>

              <h1 class="hero-shell__name">
                Ignacio Castillo
              </h1>

              <div class="hero-shell__roles">
                <span>Software Engineer</span>
                <!-- <span class="hero-shell__separator" /> -->
                <span class="hero-shell__separator" />
                <span>PhD in Computer Science</span>
              </div>

              <p class="hero-shell__summary">
                Building secure, resilient systems with a focus on software architecture, distributed platforms, and the bridge between research and engineering practice.
              </p>

              <div class="d-flex flex-wrap ga-4">
                <v-btn
                  class="text-none"
                  color="primary"
                  rounded="xl"
                  size="large"
                  to="/#projects"
                >
                  View projects
                </v-btn>

                <v-btn
                  class="text-none"
                  rounded="xl"
                  size="large"
                  variant="tonal"
                  @click="openAssistant()"
                >
                  <span class="d-inline-flex align-center ga-3">
                    <AssistantAvatar alt="AI assistant avatar" size="sm" />
                    <span>Talk with AI assistant</span>
                  </span>
                </v-btn>

                <v-btn
                  class="text-none"
                  rounded="xl"
                  size="large"
                  to="/blog"
                  variant="outlined"
                >
                  Read the blog
                </v-btn>
              </div>
            </div>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card class="hero-shell__panel glass-card" rounded="xl">
              <div class="hero-shell__panel-grid">
                <div>
                  <p class="hero-shell__panel-label">
                    Focus
                  </p>

                  <strong>Distributed software systems</strong>
                </div>

                <div>
                  <p class="hero-shell__panel-label">
                    Teaching
                  </p>

                  <strong>Professor and mentor</strong>
                </div>

                <div>
                  <p class="hero-shell__panel-label">
                    Delivery
                  </p>

                  <strong>Architecture, security, and product execution</strong>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>

<style scoped>
  .hero-scroll-track {
    height: calc(100vh + var(--hero-reveal-distance));
    height: calc(100dvh + var(--hero-reveal-distance));
    position: relative;
  }

  .hero-shell {
    align-items: center;
    display: flex;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
    position: sticky;
    top: 0;
    width: 100%;
  }

  .hero-shell__video,
  .hero-shell__poster {
    height: 100%;
    inset: 0;
    position: absolute;
    width: 100%;
  }

  .hero-shell__poster {
    background-position: center;
    background-size: cover;
  }

  .hero-shell__overlay {
    background:
      linear-gradient(
        90deg,
        var(--portfolio-overlay-start),
        var(--portfolio-overlay-mid) 55%,
        var(--portfolio-overlay-end)
      ),
      radial-gradient(circle at right, var(--portfolio-spotlight), transparent 34%);
    inset: 0;
    position: absolute;
  }

  .hero-shell__content {
    opacity: var(--hero-content-opacity);
    /* margin-top:200px; */
    /* background:red; */
    padding-bottom: 72px;
    padding-top: 72px;
    /* padding-top: 224px; */
    pointer-events: none;
    transform: translateY(var(--hero-content-translate));
    will-change: opacity, transform;
    z-index: 1;
  }

  .hero-shell__content--interactive {
    pointer-events: auto;
  }

  .hero-shell__copy {
    display: grid;
    gap: 24px;
    max-width: 760px;
  }

  .hero-chip {
    justify-self: flex-start;
    letter-spacing: 0.08em;
  }

  .hero-shell__name {
    font-size: clamp(3.1rem, 8vw, 6.4rem);
    letter-spacing: -0.05em;
    line-height: 0.96;
    margin: 0;
  }

  .hero-shell__roles {
    align-items: center;
    color: var(--portfolio-text-soft);
    display: flex;
    flex-wrap: wrap;
    font-size: clamp(1rem, 2vw, 1.22rem);
    gap: 14px;
  }

  .hero-shell__separator {
    background: var(--portfolio-accent-strong);
    border-radius: 999px;
    height: 8px;
    width: 8px;
  }

  .hero-shell__summary {
    color: var(--portfolio-text-muted);
    font-size: clamp(1rem, 2vw, 1.18rem);
    line-height: 1.8;
    margin: 0;
    max-width: 620px;
  }

  .hero-shell__panel {
    backdrop-filter: blur(18px);
    padding: 24px;
    position: relative;
  }

  .hero-shell__panel-grid {
    display: grid;
    gap: 20px;
  }

  .hero-shell__panel-label {
    color: var(--portfolio-accent);
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    margin: 0 0 6px;
    text-transform: uppercase;
  }

  @media (max-width: 960px) {
    .hero-scroll-track {
      height: auto;
    }

    .hero-shell {
      height: auto;
      min-height: 100vh;
      min-height: 100svh;
      position: relative;
    }

    .hero-shell__content {
      padding-bottom: 56px;
      padding-top: clamp(220px, 35svh, 360px);
      transform: none;
    }

    .hero-shell__panel {
      margin-top: 16px;
    }
  }

  @media (max-width: 600px) {
    .hero-shell__content {
      padding-inline: 16px;
    }

    .hero-shell__copy {
      gap: 18px;
    }

    .hero-shell__name {
      font-size: clamp(2.7rem, 15vw, 4.2rem);
    }

    .hero-shell__roles {
      align-items: flex-start;
      display: grid;
      gap: 8px;
    }

    .hero-shell__separator {
      display: none;
    }

    .hero-shell__summary {
      line-height: 1.65;
    }

    .hero-shell__copy > .d-flex {
      display: grid !important;
      gap: 12px !important;
    }

    .hero-shell__copy > .d-flex :deep(.v-btn) {
      width: 100%;
    }

    .hero-shell__panel {
      padding: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-scroll-track {
      height: auto;
      min-height: 100vh;
      min-height: 100dvh;
    }

    .hero-shell {
      height: auto;
      position: relative;
    }

    .hero-shell__content {
      opacity: 1;
      pointer-events: auto;
      transform: none;
    }
  }
</style>
