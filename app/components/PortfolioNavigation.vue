<script setup lang="ts">
  import type { NavigationItem } from '@/composables/usePortfolioData'

  defineProps<{
    items: NavigationItem[]
  }>()

  const isDrawerOpen = ref(false)

  function closeDrawer () {
    isDrawerOpen.value = false
  }
</script>

<template>
  <v-app-bar class="px-md-6" color="transparent" flat height="88">
    <div class="navigation-bar mx-auto d-flex align-center justify-space-between w-100">
      <NuxtLink
        aria-label="Ignacio Castillo — Home"
        class="navigation-brand"
        to="/"
      >
        <span class="navigation-brand__logo">
          <v-img
            alt=""
            class="navigation-brand__image navigation-brand__image--default"
            contain
            eager
            height="48"
            src="/logo_pb.png"
            width="48"
          />

          <v-img
            alt=""
            aria-hidden="true"
            class="navigation-brand__image navigation-brand__image--hover"
            contain
            eager
            height="48"
            src="/logo_pb-hover.png"
            width="48"
          />
        </span>
      </NuxtLink>

      <div class="d-none d-md-flex align-center ga-3">
        <div class="navigation-links d-flex align-center ga-2">
          <v-btn
            v-for="item in items"
            :key="item.to"
            class="text-none"
            :to="item.to"
            variant="text"
          >
            {{ item.label }}
          </v-btn>
        </div>

        <PortfolioThemePicker />
      </div>

      <div class="d-flex d-md-none align-center ga-2">
        <v-btn
          aria-label="Open navigation"
          icon="mdi-menu"
          variant="outlined"
          @click="isDrawerOpen = true"
        />
      </div>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="isDrawerOpen"
    class="navigation-drawer"
    location="right"
    temporary
    width="320"
  >
    <div class="navigation-drawer__header">
      <div>
        <p class="navigation-drawer__eyebrow">Navigation</p>
        <strong>Ignacio Castillo</strong>
      </div>

      <v-btn
        aria-label="Close navigation"
        icon="mdi-close"
        variant="text"
        @click="closeDrawer()"
      />
    </div>

    <v-divider />

    <v-list bg-color="transparent" class="pa-3" nav>
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :prepend-icon="item.to === '/blog' ? 'mdi-post-outline' : 'mdi-chevron-right'"
        rounded="xl"
        :title="item.label"
        :to="item.to"
        @click="closeDrawer()"
      />
    </v-list>

    <template #append>
      <div class="navigation-drawer__theme">
        <p class="navigation-drawer__eyebrow">Appearance</p>
        <PortfolioThemePicker compact />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
  .navigation-bar {
    backdrop-filter: blur(18px);
    background: var(--portfolio-nav-bg);
    border: 1px solid var(--portfolio-nav-border);
    border-radius: 999px;
    max-width: min(1180px, calc(100% - 24px));
    padding: 14px 18px;
    transition:
      background 220ms ease,
      border-color 220ms ease;
  }

  .navigation-brand {
    align-items: center;
    color: var(--portfolio-text);
    display: inline-flex;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .navigation-brand__logo {
    display: block;
    flex: 0 0 48px;
    height: 48px;
    position: relative;
    width: 48px;
  }

  .navigation-brand__image {
    inset: 0;
    position: absolute;
    transition: opacity 220ms ease;
  }

  .navigation-brand__image--default {
    opacity: 1;
  }

  .navigation-brand__image--hover {
    opacity: 0;
  }

  .navigation-brand:hover .navigation-brand__image--default,
  .navigation-brand:focus-visible .navigation-brand__image--default {
    opacity: 0;
  }

  .navigation-brand:hover .navigation-brand__image--hover,
  .navigation-brand:focus-visible .navigation-brand__image--hover {
    opacity: 1;
  }

  .navigation-brand__compact {
    display: none;
  }

  .navigation-drawer {
    background: var(--portfolio-bg-elevated);
    color: var(--portfolio-text);
    width: min(320px, 88vw) !important;
  }

  .navigation-drawer__header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }

  .navigation-drawer__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    margin: 0 0 4px;
    text-transform: uppercase;
  }

  .navigation-drawer__theme {
    border-top: 1px solid var(--portfolio-border);
    display: grid;
    gap: 10px;
    padding: 20px;
  }

  :deep(.v-btn) {
    color: var(--portfolio-text-muted);
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  @media (max-width: 360px) {
    .navigation-brand__full {
      display: none;
    }

    .navigation-brand__compact {
      display: inline;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .navigation-brand__image {
      transition: none;
    }
  }
</style>
