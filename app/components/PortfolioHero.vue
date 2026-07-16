<script setup lang="ts">
  import type { CSSProperties } from 'vue'

  const { openAssistant } = useAssistantWidget()
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL || '/'
  const heroVideoSrc = `${baseURL}hero_video.mp4`
  const heroPosterSrc = `${baseURL}hero_image.png`

  const trackRef = ref<HTMLElement | null>(null)
  const contentBodyRef = ref<HTMLElement | null>(null)
  const revealDistance = ref(0)
  const holdDistance = ref(0)
  const entranceOffset = ref(0)
  const safeTop = ref(112)
  const revealProgress = ref(0)
  const isParallaxEnabled = ref(false)
  const isReady = ref(false)
  const reducedMotion = ref(false)

  let animationFrame = 0
  let entranceFrame = 0
  let resizeObserver: ResizeObserver | null = null
  let motionPreference: MediaQueryList | null = null

  const trackStyle = computed<CSSProperties>(() => ({
    '--hero-safe-top': `${safeTop.value}px`,
    '--hero-scroll-distance': `${revealDistance.value + holdDistance.value}px`,
    '--hero-content-opacity': revealProgress.value,
    '--hero-content-translate': `${entranceOffset.value * (1 - revealProgress.value)}px`,
  }))

  function updateRevealProgress () {
    animationFrame = 0

    if (reducedMotion.value || !isParallaxEnabled.value) {
      revealProgress.value = 1
      return
    }

    const track = trackRef.value

    if (!track) {
      return
    }

    const rawProgress = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / revealDistance.value))

    revealProgress.value = 1 - (1 - rawProgress) ** 3
  }

  function requestRevealUpdate () {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateRevealProgress)
    }
  }

  function measureHero () {
    const contentBody = contentBodyRef.value
    const navigation = document.querySelector<HTMLElement>('.v-app-bar')

    if (!contentBody || !navigation) {
      return
    }

    const viewportHeight = window.innerHeight
    const navigationBottom = Math.ceil(navigation.getBoundingClientRect().bottom)
    const topClearance = 24
    const bottomClearance = 32
    const availableHeight = viewportHeight - navigationBottom - topClearance - bottomClearance
    const contentHeight = Math.ceil(contentBody.getBoundingClientRect().height)

    safeTop.value = navigationBottom + topClearance
    revealDistance.value = Math.min(420, Math.max(260, Math.round(viewportHeight * 0.4)))
    holdDistance.value = Math.min(96, Math.max(64, Math.round(viewportHeight * 0.1)))
    entranceOffset.value = Math.min(240, Math.max(120, Math.round(viewportHeight * 0.22)))
    isParallaxEnabled.value = !reducedMotion.value
      && window.innerWidth > 960
      && contentHeight <= availableHeight

    updateRevealProgress()
  }

  function handleMotionPreference (event: MediaQueryListEvent) {
    reducedMotion.value = event.matches
    measureHero()
  }

  onMounted(() => {
    motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.value = motionPreference.matches

    measureHero()
    window.addEventListener('scroll', requestRevealUpdate, { passive: true })
    window.addEventListener('resize', measureHero)
    motionPreference.addEventListener('change', handleMotionPreference)

    resizeObserver = new ResizeObserver(measureHero)

    if (contentBodyRef.value) {
      resizeObserver.observe(contentBodyRef.value)
    }

    entranceFrame = window.requestAnimationFrame(() => {
      isReady.value = true
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', requestRevealUpdate)
    window.removeEventListener('resize', measureHero)
    motionPreference?.removeEventListener('change', handleMotionPreference)
    resizeObserver?.disconnect()

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame)
    }

    if (entranceFrame) {
      window.cancelAnimationFrame(entranceFrame)
    }
  })
</script>

<template>
  <section
    ref="trackRef"
    class="hero-scroll-track motif-border"
    :class="{
      'hero-scroll-track--parallax': isParallaxEnabled,
      'hero-scroll-track--ready': isReady,
    }"
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
        :class="{ 'hero-shell__content--interactive': !isParallaxEnabled || revealProgress > 0.02 }"
        max-width="1180"
      >
        <div ref="contentBodyRef" class="hero-shell__body">
          <v-row align="center">
            <v-col cols="12" lg="8">
              <div class="hero-shell__copy">
                <v-chip class="hero-chip text-uppercase" color="primary" variant="tonal">
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
        </div>
      </v-container>
    </div>
  </section>
</template>

<style scoped>
  .hero-scroll-track {
    overflow: clip;
    position: relative;
  }

  .hero-shell {
    align-items: center;
    display: flex;
    height: auto;
    min-height: 100vh;
    min-height: 100svh;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .hero-scroll-track--parallax {
    height: calc(100vh + var(--hero-scroll-distance));
    height: calc(100dvh + var(--hero-scroll-distance));
  }

  .hero-scroll-track--parallax .hero-shell {
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    position: sticky;
    top: 0;
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
    opacity: 0;
    padding-bottom: 56px;
    padding-top: var(--hero-safe-top);
    pointer-events: none;
    transform: translateY(48px);
    transition:
      opacity 700ms ease,
      transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 1;
  }

  .hero-scroll-track--ready:not(.hero-scroll-track--parallax) .hero-shell__content {
    opacity: 1;
    transform: none;
  }

  .hero-scroll-track--parallax .hero-shell__content {
    align-items: center;
    display: flex;
    height: 100%;
    opacity: var(--hero-content-opacity);
    padding-bottom: 32px;
    padding-top: var(--hero-safe-top);
    transform: translateY(var(--hero-content-translate));
    transition: none;
    will-change: opacity, transform;
  }

  .hero-shell__content--interactive {
    pointer-events: auto;
  }

  .hero-shell__body {
    width: 100%;
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
    .hero-shell__content {
      padding-bottom: 56px;
      padding-top: clamp(220px, 35svh, 360px);
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
      transition: none;
      transform: none;
    }
  }
</style>
