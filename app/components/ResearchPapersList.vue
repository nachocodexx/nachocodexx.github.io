<script setup lang="ts">
  import type { PaperEntry } from '@/composables/usePortfolioData'

  const props = defineProps<{
    papers: PaperEntry[]
  }>()
  const { smAndDown } = useDisplay()
  const hasMultiplePapers = computed(() => props.papers.length > 1)

  function getDoiUrl (doi: string) {
    return `https://doi.org/${doi}`
  }
</script>

<template>
  <div class="research-papers-carousel">
    <v-slide-group
      aria-label="Research papers carousel"
      center-active
      class="research-papers-carousel__track"
      :show-arrows="!smAndDown && hasMultiplePapers"
    >
      <v-slide-group-item
        v-for="paper in papers"
        :key="paper.title"
      >
        <article class="research-papers-carousel__item">
          <v-card
            :aria-label="`Open ${paper.title} on DOI.org in a new tab`"
            class="research-papers__card glass-card h-100 d-flex flex-column pa-6"
            :href="getDoiUrl(paper.doi)"
            rel="noopener noreferrer"
            rounded="xl"
            target="_blank"
          >
            <p class="research-papers__meta">
              {{ paper.venue }} · {{ paper.year }}
            </p>

            <h3 class="research-papers__title">
              {{ paper.title }}
            </h3>

            <p class="research-papers__summary">
              {{ paper.summary }}
            </p>

            <p class="research-papers__authors">
              {{ paper.authors }}
            </p>

            <div class="mt-auto pt-4 d-flex flex-wrap align-center ga-3">
              <v-chip
                class="research-papers__doi text-none"
                color="primary"
                size="small"
                variant="tonal"
              >
                DOI {{ paper.doi }}
              </v-chip>

              <span
                class="research-papers__link d-inline-flex align-center ga-2"
              >
                <span>Open DOI</span>
                <v-icon icon="mdi-open-in-new" size="18" />
              </span>
            </div>
          </v-card>
        </article>
      </v-slide-group-item>
    </v-slide-group>

    <p v-if="hasMultiplePapers" class="research-papers-carousel__hint">
      Scroll or use the arrows to explore {{ papers.length }} research papers.
    </p>
  </div>
</template>

<style scoped>
  .research-papers-carousel {
    display: grid;
    gap: 12px;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    width: 100%;
  }

  .research-papers-carousel__track {
    margin-inline: -16px;
    max-width: 100%;
    min-width: 0;
  }

  .research-papers-carousel__track :deep(.v-slide-group__content) {
    align-items: stretch;
  }

  .research-papers-carousel__item {
    height: 100%;
    padding: 8px;
    width: min(88vw, 460px);
  }

  .research-papers__card {
    cursor: pointer;
    min-width: 0;
    transition:
      border-color 180ms ease,
      transform 180ms ease;
  }

  .research-papers__card:focus-visible,
  .research-papers__card:hover {
    border-color: color-mix(in srgb, var(--portfolio-accent) 54%, var(--portfolio-border));
    outline: none;
    transform: translateY(-3px);
  }

  .research-papers__meta {
    color: var(--portfolio-accent);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0 0 14px;
    text-transform: uppercase;
  }

  .research-papers__title {
    line-height: 1.35;
    margin: 0 0 12px;
  }

  .research-papers__summary {
    color: var(--portfolio-text-muted);
    line-height: 1.75;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .research-papers__authors {
    color: var(--portfolio-text-soft);
    font-size: 0.94rem;
    line-height: 1.7;
    margin: 18px 0 0;
  }

  .research-papers__link {
    color: var(--portfolio-accent);
    font-weight: 600;
  }

  .research-papers__doi {
    height: auto;
    max-width: 100%;
    overflow-wrap: anywhere;
    white-space: normal;
  }

  .research-papers-carousel__hint {
    color: var(--portfolio-text-muted);
    font-size: 0.85rem;
    margin: 0;
    overflow-wrap: anywhere;
    text-align: center;
  }

  @media (min-width: 700px) {
    .research-papers-carousel__item {
      width: 420px;
    }
  }

  @media (min-width: 1100px) {
    .research-papers-carousel__item {
      width: 450px;
    }
  }

  @media (max-width: 600px) {
    .research-papers-carousel__track {
      margin-inline: -8px;
    }

    .research-papers__card {
      padding: 20px !important;
    }

    .research-papers__title,
    .research-papers__authors {
      overflow-wrap: anywhere;
    }
  }
</style>
