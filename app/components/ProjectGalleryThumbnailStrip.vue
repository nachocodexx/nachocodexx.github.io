<script setup lang="ts">
  import type { ProjectGalleryImage } from '~~/utils/portfolioContent'

  defineProps<{
    activeIndex: number
    images: ProjectGalleryImage[]
  }>()

  const emit = defineEmits<{
    open: [index: number]
    select: [index: number]
  }>()
</script>

<template>
  <v-slide-group class="project-gallery-thumbnail-strip" show-arrows>
    <v-slide-group-item
      v-for="(image, index) in images"
      :key="`${image.src}-${index}`"
    >
      <button
        :aria-label="`Show ${image.alt}`"
        :aria-pressed="index === activeIndex"
        :class="[
          'project-gallery-thumbnail-strip__item',
          { 'project-gallery-thumbnail-strip__item--active': index === activeIndex },
        ]"
        type="button"
        @click="emit('select', index)"
        @dblclick="emit('open', index)"
      >
        <v-img :alt="image.alt" aspect-ratio="1" cover :src="image.src" />
      </button>
    </v-slide-group-item>
  </v-slide-group>
</template>

<style scoped>
  .project-gallery-thumbnail-strip {
    min-height: 84px;
  }

  .project-gallery-thumbnail-strip :deep(.v-slide-group__container) {
    padding-block: 4px;
  }

  .project-gallery-thumbnail-strip :deep(.v-slide-group__content) {
    gap: 8px;
    padding-inline: 4px;
  }

  .project-gallery-thumbnail-strip__item {
    appearance: none;
    background: transparent;
    border: 1px solid var(--portfolio-border);
    border-radius: 12px;
    color: inherit;
    cursor: pointer;
    display: block;
    height: 76px;
    overflow: hidden;
    padding: 0;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    width: 76px;
  }

  .project-gallery-thumbnail-strip__item:hover,
  .project-gallery-thumbnail-strip__item:focus-visible {
    transform: translateY(-2px);
  }

  .project-gallery-thumbnail-strip__item:focus-visible {
    outline: 2px solid var(--portfolio-accent);
    outline-offset: 2px;
  }

  .project-gallery-thumbnail-strip__item--active {
    border-color: var(--portfolio-accent);
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--portfolio-accent) 45%, transparent);
  }

  @media (max-width: 600px) {
    .project-gallery-thumbnail-strip {
      min-height: 72px;
    }

    .project-gallery-thumbnail-strip__item {
      height: 64px;
      width: 64px;
    }

    .project-gallery-thumbnail-strip :deep(.v-slide-group__prev),
    .project-gallery-thumbnail-strip :deep(.v-slide-group__next) {
      display: none;
    }
  }
</style>
