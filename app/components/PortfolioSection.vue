<script setup lang="ts">
  defineProps<{
    id: string
    title: string
    eyebrow?: string
    description?: string
  }>()
</script>

<template>
  <section :id="id" class="section-anchor-offset section-shell">
    <div class="section-shell__heading">
      <p v-if="eyebrow" class="section-shell__eyebrow">
        {{ eyebrow }}
      </p>

      <h2 class="section-shell__title">
        {{ title }}
      </h2>

      <p v-if="description" class="section-shell__description">
        {{ description }}
      </p>
    </div>

    <slot />
  </section>
</template>
