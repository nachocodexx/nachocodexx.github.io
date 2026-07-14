<script setup lang="ts">
  import type { ProjectGalleryImage } from '@/composables/usePortfolioData'

  const props = defineProps<{
    images: ProjectGalleryImage[]
    title: string
  }>()

  const activeIndex = ref(0)
  const isDialogOpen = ref(false)
  const { smAndDown } = useDisplay()

  const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0])

  function selectImage (index: number) {
    activeIndex.value = index
  }

  function openDialog (index = activeIndex.value) {
    selectImage(index)
    isDialogOpen.value = true
  }

  function showPreviousImage () {
    activeIndex.value = activeIndex.value === 0
      ? props.images.length - 1
      : activeIndex.value - 1
  }

  function showNextImage () {
    activeIndex.value = activeIndex.value === props.images.length - 1
      ? 0
      : activeIndex.value + 1
  }
</script>

<template>
  <div class="project-gallery">
    <v-card class="glass-card overflow-hidden" rounded="xl">
      <button
        :aria-label="`Open ${activeImage.alt} in the full gallery`"
        class="project-gallery__preview-button"
        type="button"
        @click="openDialog()"
      >
        <img
          :alt="activeImage.alt"
          class="project-gallery__preview-image"
          :src="activeImage.src"
        >

        <div class="project-gallery__preview-open-hint">
          <v-icon icon="mdi-arrow-expand" size="20" />
          <span>Click to view full size</span>
        </div>

        <div class="project-gallery__preview-overlay">
          <div>
            <p class="project-gallery__eyebrow">
              Project gallery
            </p>

            <strong>{{ activeImage.alt }}</strong>
          </div>

          <v-chip class="text-none" color="primary" size="small" variant="tonal">
            {{ activeIndex + 1 }} / {{ images.length }}
          </v-chip>
        </div>
      </button>
    </v-card>

    <p v-if="activeImage.caption" class="project-gallery__caption">
      {{ activeImage.caption }}
    </p>

    <ProjectGalleryThumbnailStrip
      :active-index="activeIndex"
      :images="images"
      @open="openDialog"
      @select="selectImage"
    />

    <v-dialog
      v-model="isDialogOpen"
      :fullscreen="smAndDown"
      max-width="1200"
      :width="smAndDown ? undefined : 'calc(100% - 48px)'"
    >
      <v-card class="glass-card project-gallery__dialog" rounded="xl">
        <div class="project-gallery__dialog-toolbar">
          <div>
            <p class="project-gallery__eyebrow mb-1">
              {{ title }}
            </p>

            <p class="project-gallery__dialog-title">
              {{ activeImage.alt }}
            </p>
          </div>

          <v-btn
            aria-label="Close gallery"
            icon="mdi-close"
            variant="text"
            @click="isDialogOpen = false"
          />
        </div>

        <div class="project-gallery__dialog-stage">
          <v-btn
            aria-label="Previous image"
            class="project-gallery__dialog-nav project-gallery__dialog-nav--previous"
            color="primary"
            icon="mdi-chevron-left"
            variant="tonal"
            @click="showPreviousImage"
          />

          <v-img
            :alt="activeImage.alt"
            class="project-gallery__dialog-image"
            contain
            :src="activeImage.src"
          />

          <v-btn
            aria-label="Next image"
            class="project-gallery__dialog-nav project-gallery__dialog-nav--next"
            color="primary"
            icon="mdi-chevron-right"
            variant="tonal"
            @click="showNextImage"
          />
        </div>

        <div class="project-gallery__dialog-footer">
          <p v-if="activeImage.caption" class="project-gallery__caption">
            {{ activeImage.caption }}
          </p>

          <v-chip class="text-none" color="primary" size="small" variant="tonal">
            {{ activeIndex + 1 }} / {{ images.length }}
          </v-chip>
        </div>

      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
  .project-gallery {
    display: grid;
    gap: 16px;
    margin-inline: auto;
    width: 100%;
  }

  .project-gallery__preview-button {
    appearance: none;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: block;
    padding: 0;
  }

  .project-gallery__preview-button {
    background:
      radial-gradient(circle at top, color-mix(in srgb, var(--portfolio-accent) 10%, transparent), transparent 58%),
    color-mix(in srgb, var(--portfolio-bg) 86%, var(--portfolio-bg-soft));
    display: grid;
    height: 520px;
    overflow: hidden;
    /* padding: 16px; */
    place-items: center;
    position: relative;
    text-align: left;
    width: 100%;
  }

  .project-gallery__preview-image {
    display: block;
    max-height: 520px;
    /* aspect-ratio: 4/3; */
    /* width:40%; */
    /* height: 100%; */
    /* height: 520px; */
    /* width: auto; */
    object-fit: contain;
  }

  .project-gallery__preview-open-hint {
    align-items: center;
    background: color-mix(in srgb, var(--portfolio-bg) 84%, transparent);
    border: 1px solid color-mix(in srgb, var(--portfolio-accent) 44%, var(--portfolio-border));
    border-radius: 999px;
    color: var(--portfolio-text);
    display: flex;
    font-size: 0.875rem;
    font-weight: 700;
    gap: 8px;
    left: 50%;
    opacity: 0;
    padding: 10px 14px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -42%);
    transition: opacity 180ms ease, transform 180ms ease;
    white-space: nowrap;
    z-index: 1;
  }

  .project-gallery__preview-button:hover .project-gallery__preview-open-hint,
  .project-gallery__preview-button:focus-visible .project-gallery__preview-open-hint {
    opacity: 1;
    transform: translate(-50%, -50%);
  }

  .project-gallery__preview-overlay {
    align-items: end;
    background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--portfolio-bg) 78%, transparent));
    bottom: 0;
    display: flex;
    gap: 16px;
    justify-content: space-between;
    left: 0;
    padding: 20px;
    position: absolute;
    right: 0;
  }

  .project-gallery__eyebrow {
    color: var(--portfolio-accent);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0;
    text-transform: uppercase;
  }

  .project-gallery__caption {
    color: var(--portfolio-text-muted);
    line-height: 1.7;
    margin: 0;
  }

  .project-gallery__dialog {
    border: 1px solid color-mix(in srgb, var(--portfolio-accent) 18%, var(--portfolio-border));
    padding: 12px;
  }

  .project-gallery__dialog-toolbar,
  .project-gallery__dialog-footer {
    align-items: center;
    display: flex;
    gap: 16px;
    justify-content: space-between;
  }

  .project-gallery__dialog-toolbar {
    padding: 4px 4px 12px;
  }

  .project-gallery__dialog-title {
    color: var(--portfolio-text);
    font-weight: 700;
    margin: 0;
  }

  .project-gallery__dialog-stage {
    align-items: center;
    display: grid;
    gap: 12px;
    grid-template-columns: auto minmax(0, 1fr) auto;
    padding: 8px 4px 16px;
  }

  .project-gallery__dialog-image {
    background: color-mix(in srgb, var(--portfolio-bg) 82%, transparent);
    border-radius: 16px;
    height: min(68vh, 680px);
    width: 100%;
  }

  .project-gallery__dialog-footer {
    border-top: 1px solid color-mix(in srgb, var(--portfolio-accent) 12%, var(--portfolio-border));
    min-height: 48px;
    padding: 12px 4px;
  }

  .project-gallery__dialog-footer .project-gallery__caption {
    max-width: 80ch;
  }

  @media (max-width: 960px) {
    .project-gallery__preview-button {
      height: 380px;
    }
  }

  @media (max-width: 600px) {
    .project-gallery__preview-button {
      height: 300px;
      padding: 12px;
    }

    .project-gallery__preview-overlay {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 16px;
    }

    .project-gallery__dialog {
      border-radius: 0 !important;
      height: 100%;
      overflow-y: auto;
      padding: 8px;
    }

    .project-gallery__dialog-toolbar {
      align-items: flex-start;
    }

    .project-gallery__dialog-stage {
      grid-template-columns: repeat(2, 1fr);
      padding: 4px 0 12px;
    }

    .project-gallery__dialog-image {
      grid-column: 1 / -1;
      grid-row: 1;
      height: min(54vh, 460px);
    }

    .project-gallery__dialog-nav--previous {
      grid-column: 1;
      grid-row: 2;
      justify-self: end;
    }

    .project-gallery__dialog-nav--next {
      grid-column: 2;
      grid-row: 2;
      justify-self: start;
    }

    .project-gallery__dialog-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
