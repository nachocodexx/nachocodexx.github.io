<script setup lang="ts">
  import type { PaperEntry } from '@/composables/usePortfolioData'

  defineProps<{
    papers: PaperEntry[]
  }>()

  function getDoiUrl (doi: string) {
    return `https://doi.org/${doi}`
  }
</script>

<template>
  <v-row>
    <v-col
      v-for="paper in papers"
      :key="paper.title"
      cols="12"
      md="6"
      xl="4"
    >
      <v-card class="glass-card h-100 d-flex flex-column pa-6" rounded="xl">
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

          <a
            class="research-papers__link d-inline-flex align-center ga-2"
            :href="getDoiUrl(paper.doi)"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Open DOI</span>
            <v-icon icon="mdi-open-in-new" size="18" />
          </a>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
  :deep(.v-row),
  :deep(.v-col),
  :deep(.v-card) {
    max-width: 100%;
    min-width: 0;
  }

  :deep(.v-row) {
    width: 100%;
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
    white-space: normal;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    :deep(.v-card) {
      padding: 20px !important;
    }

    .research-papers__title,
    .research-papers__authors {
      overflow-wrap: anywhere;
    }
  }
</style>
