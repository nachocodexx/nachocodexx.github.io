<script setup lang="ts">
  const props = withDefaults(defineProps<{
    href?: string | null
    to?: string | null
  }>(), {
    href: null,
    to: null,
  })
</script>

<template>
  <NuxtLink
    v-if="props.to"
    class="special-text special-text--interactive"
    :to="props.to"
  >
    <slot />
  </NuxtLink>

  <a
    v-else-if="props.href"
    class="special-text special-text--interactive"
    :href="props.href"
    rel="noopener noreferrer"
    target="_blank"
  >
    <slot />

    <v-icon
      aria-hidden="true"
      class="special-text__external-icon"
      icon="mdi-open-in-new"
      size="0.8em"
    />

    <span class="special-text__screen-reader-text">
      (opens in a new tab)
    </span>
  </a>

  <span v-else class="special-text special-text--static">
    <slot />
  </span>
</template>

<style scoped>
  .special-text {
    align-items: center;
    background: rgba(var(--v-theme-primary), 0.12);
    border: 1px solid rgba(var(--v-theme-primary), 0.3);
    border-radius: 999px;
    color: rgb(var(--v-theme-primary));
    display: inline-flex;
    font-size: 0.92em;
    font-weight: 700;
    gap: 0.28em;
    line-height: 1.35;
    margin-inline: 0.08em;
    padding: 0.08em 0.55em;
    text-decoration: none;
    vertical-align: baseline;
    white-space: nowrap;
  }

  .special-text--interactive {
    cursor: pointer;
    transition:
      background-color 170ms ease,
      border-color 170ms ease,
      box-shadow 170ms ease,
      color 170ms ease,
      transform 170ms ease;
  }

  .special-text--interactive:hover {
    background: rgb(var(--v-theme-primary));
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.24);
    color: rgb(var(--v-theme-on-primary));
    transform: translateY(-1px);
  }

  .special-text--interactive:focus-visible {
    background: rgb(var(--v-theme-primary));
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.24);
    color: rgb(var(--v-theme-on-primary));
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
    transform: translateY(-1px);
  }

  .special-text__external-icon {
    flex: 0 0 auto;
  }

  .special-text__screen-reader-text {
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .special-text--interactive {
      transition: none;
    }

    .special-text--interactive:hover,
    .special-text--interactive:focus-visible {
      transform: none;
    }
  }
</style>
